import express from 'express';
import {
  getInstallmentPlans,
  getInstallmentPlan,
  createInstallmentPlan,
  payInstallment,
  payDownPayment,
  getOverdueInstallments,
  sendReminder,
} from '../controllers/installment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { roleGuard } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, getInstallmentPlans);
router.get('/overdue', authenticate, roleGuard('admin'), getOverdueInstallments);
router.get('/:id', authenticate, getInstallmentPlan);
router.post('/', authenticate, roleGuard('admin'), createInstallmentPlan);
router.post('/:id/pay', authenticate, payInstallment);
router.post('/:id/down-payment', authenticate, payDownPayment);
router.post('/:id/remind', authenticate, roleGuard('admin'), sendReminder);

export default router;

