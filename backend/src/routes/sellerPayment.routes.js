import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { roleGuard } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, roleGuard('admin'), (req, res) => {
  res.json({ message: 'Get seller payments - to be implemented' });
});

export default router;

