import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { roleGuard } from '../middleware/auth.middleware.js';
import {
  getAllSellerPayments,
  getSellerPaymentById,
  createSellerPayment,
  updateSellerPayment,
  recordPayment,
  getSellerPaymentLedger,
} from '../controllers/sellerPayment.controller.js';

const router = express.Router();

router.use(authenticate);
router.use(roleGuard('admin'));

router.get('/', getAllSellerPayments);
router.get('/:id', getSellerPaymentById);
router.post('/', createSellerPayment);
router.put('/:id', updateSellerPayment);
router.post('/:id/pay', recordPayment);
router.get('/:id/ledger', getSellerPaymentLedger);

export default router;

