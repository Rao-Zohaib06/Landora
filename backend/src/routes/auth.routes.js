import express from 'express';
import {
  register,
  login,
  getMe,
  refreshToken,
  logout,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refreshToken);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

export default router;

