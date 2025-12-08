import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { roleGuard } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/bank-statement', authenticate, roleGuard('admin'), (req, res) => {
  res.json({ message: 'Import bank statement - to be implemented' });
});

export default router;

