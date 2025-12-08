import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { roleGuard } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);
router.get('/', authenticate, roleGuard('admin'), getUsers);
router.get('/:id', authenticate, roleGuard('admin'), getUser);
router.post('/', authenticate, roleGuard('admin'), createUser);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, roleGuard('admin'), deleteUser);

export default router;

