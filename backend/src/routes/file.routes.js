import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { uploadFile, getFile, deleteFile } from '../controllers/file.controller.js';

const router = express.Router();

router.use(authenticate);

router.post('/upload', uploadFile);
router.get('/:filename', getFile);
router.delete('/:filename', deleteFile);

export default router;

