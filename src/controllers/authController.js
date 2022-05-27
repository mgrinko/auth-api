import * as userService from '../services/userService.js';
import { ApiError } from '../exceptions/api-error.js';

function sendAuthReponse(res, { user, accessToken, refreshToken }) {
  res.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  res.send({ user, accessToken });
}

function validateEmail(value) {
  if (!value) {
    return 'Email is required';
  }

  const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

  if (!emailPattern.test(value)) {
    return 'Email is not valid';
  }
}

const validatePassword = (value) => {
  if (!value) {
    return 'Password is required';
  }
  
  if (value.length < 6) {
    return 'At least 6 characters';
  }
};

export async function registration(req, res, next) {
  try {
    const { email, password } = req.body;

    const errors = {
      email: validateEmail(email),
      password: validatePassword(password),
    }
    
    if (errors.password || errors.email) {
      next(ApiError.BadRequest('Validation error', errors));
      return;
    }

    await userService.register(email, password);

    return res.sendStatus(201);
  } catch (error) {
    next(error);
  }
}

export async function activate(req, res, next) {
  const { token } = req.params;

  try {
    const authData = await userService.activate(token);

    sendAuthReponse(res, authData);
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const authData = await userService.login(email, password);

    sendAuthReponse(res, authData);
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const { refreshToken } = req.cookies;

    await userService.logout(refreshToken);
    res.clearCookie('refreshToken');

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.cookies;
    const authData = await userService.refresh(refreshToken);

    sendAuthReponse(res, authData);
  } catch (error) {
    next(error);
  }
}
