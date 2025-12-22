import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.middleware.js';
import { roleGuard } from '../middleware/auth.middleware.js';
import { uploadBankStatementCSV } from '../controllers/import.controller.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate);
router.use(roleGuard('admin'));

router.post('/bank-statement/:accountId', upload.single('file'), uploadBankStatementCSV);

export default router;

