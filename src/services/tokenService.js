import { Token } from '../models/Token.js';

export async function saveRefreshToken(userId, refreshToken) {
  const token = await Token.findOne({
    where: { refreshToken }
  });

  if (token) {
    token.refreshToken = refreshToken;
    return token.save();
  }

  return Token.create({ refreshToken, userId })
}

export function removeToken(refreshToken) {
  return Token.destroy({
    where: { refreshToken }
  });
}

export function findRefreshToken(refreshToken) {
  return Token.findOne({
    where: { refreshToken },
  });
}
