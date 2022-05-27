import bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';

import { ApiError } from '../exceptions/api-error.js';
import { User } from '../models/User.js';
import * as emailService from './emailService.js';
import * as tokenService from './tokenService.js';
import * as jwtService from './jwtService.js';

async function authenticate(user) {
  const userDTO = { id: user.id, email: user.email };
  const refreshToken = jwtService.generateRefreshToken(userDTO);
  const accessToken = jwtService.generateAccessToken(userDTO);

  await tokenService.saveRefreshToken(user.id, refreshToken);

  return {
    user: userDTO,
    accessToken,
    refreshToken,
  }
}

export async function register(email, password) {
  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw ApiError.BadRequest('Email is already taken', {
      email: 'Email is already taken',
    });
  }

  const activationToken = uuidV4();
  const hash = await bcrypt.hash(password, 3);

  const user = await User.create({
    email,
    password: hash,
    activationToken,
  });

  await emailService.sendActivationMail(user);
}

export async function activate(activationToken) {
  const user = await User.findOne({
    where: { activationToken }
  });

  if (!user) {
    throw ApiError.BadRequest('Activation token is not valid');
  }

  user.activationToken = null;
  await user.save();

  return authenticate(user);
}

export async function login(email, password) {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw ApiError.BadRequest('User with this email does not exist');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.BadRequest('Password is wrong');
  }

  return authenticate(user);
}

export function logout(refreshToken) {
  return tokenService.removeToken(refreshToken);
}

export async function refresh(refreshToken) {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError()
  }

  const userData = jwtService.validateRefreshToken(refreshToken);
  const savedToken = await tokenService.findRefreshToken(refreshToken)

  if (!userData || !savedToken) {
    throw ApiError.UnauthorizedError()
  } 

  const user = await User.findByPk(userData.id);
  
  return authenticate(user);
}

export function getAll() {
  return User.findAll();
}
