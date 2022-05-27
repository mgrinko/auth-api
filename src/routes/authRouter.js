import express from 'express';
import * as authController from '../controllers/authController.js';

export const router = express.Router();

router.post('/registration', authController.registration);
router.get('/activate/:token', authController.activate);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/refresh', authController.refresh);
