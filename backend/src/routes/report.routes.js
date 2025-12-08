import express from 'express';
import {
  getProfitLossReport,
  getCashFlowReport,
  getReceivablesAgingReport,
  getMonthlyProgressReport,
  getProjectReport,
} from '../controllers/report.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { roleGuard } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/profit-loss', authenticate, roleGuard('admin'), getProfitLossReport);
router.get('/cash-flow', authenticate, roleGuard('admin'), getCashFlowReport);
router.get('/receivables-aging', authenticate, roleGuard('admin'), getReceivablesAgingReport);
router.get('/monthly-progress', authenticate, roleGuard('admin'), getMonthlyProgressReport);
router.get('/project/:projectId', authenticate, roleGuard('admin'), getProjectReport);

export default router;

