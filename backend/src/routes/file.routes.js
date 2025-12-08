import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/upload', authenticate, (req, res) => {
  res.json({ message: 'Upload file - to be implemented' });
});

export default router;

