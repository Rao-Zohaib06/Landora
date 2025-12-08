import express from 'express';
import {
  getCommissions,
  getCommission,
  calculateCommissionAmount,
  createCommissionRecord,
  approveCommissionRecord,
  payCommissionRecord,
  getCommissionRules,
  createCommissionRule,
} from '../controllers/commission.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { roleGuard } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, getCommissions);
router.get('/rules', authenticate, roleGuard('admin'), getCommissionRules);
router.post('/rules', authenticate, roleGuard('admin'), createCommissionRule);
router.get('/:id', authenticate, getCommission);
router.post('/calculate', authenticate, roleGuard('admin'), calculateCommissionAmount);
router.post('/', authenticate, roleGuard('admin'), createCommissionRecord);
router.put('/:id/approve', authenticate, roleGuard('admin'), approveCommissionRecord);
router.put('/:id/pay', authenticate, roleGuard('admin'), payCommissionRecord);

export default router;

