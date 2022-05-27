import express from 'express';
import * as userController from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

export const router = express.Router();

router.get('/', authMiddleware, userController.getAll);
