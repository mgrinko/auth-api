import { ApiError } from '../exceptions/api-error.js';
import * as tokenService from '../services/tokenService.js';
import * as jwtService from '../services/jwtService.js';

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      next(ApiError.UnauthorizedError());
      return;
    }

    const [, accessToken] = authHeader.split(' ');

    if (!accessToken) {
      next(ApiError.UnauthorizedError());
      return;
    }

    const userData = jwtService.validateAccessToken(accessToken);

    if (!userData) {
      next(ApiError.UnauthorizedError());
      return;
    }

    req.user = userData;
    next();
  } catch (error) {
    next(ApiError.UnauthorizedError());
  }
}