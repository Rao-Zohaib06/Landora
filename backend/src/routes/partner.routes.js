import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { roleGuard } from '../middleware/auth.middleware.js';
import {
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
  addCapitalTransaction,
  distributeProfit,
  approveProfitDistribution,
  getPartnerLedger,
} from '../controllers/partner.controller.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(roleGuard('admin'));

router.get('/', getAllPartners);
router.get('/:id', getPartnerById);
router.post('/', createPartner);
router.put('/:id', updatePartner);
router.delete('/:id', deletePartner);

// Capital transactions
router.post('/:id/capital', addCapitalTransaction);

// Profit distribution
router.post('/:id/profit', distributeProfit);
router.put('/:id/profit/:distributionId', approveProfitDistribution);

// Ledger
router.get('/:id/ledger', getPartnerLedger);

export default router;

