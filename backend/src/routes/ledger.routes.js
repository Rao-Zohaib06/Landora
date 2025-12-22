import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { roleGuard } from '../middleware/auth.middleware.js';
import {
  getAllLedgerEntries,
  getLedgerByAccount,
  getReceivablesAging,
  exportLedger,
  reconcileLedgerEntry,
} from '../controllers/ledger.controller.js';

const router = express.Router();

router.use(authenticate);
router.use(roleGuard('admin'));

router.get('/', getAllLedgerEntries);
router.get('/account/:account', getLedgerByAccount);
router.get('/receivables-aging', getReceivablesAging);
router.get('/export', exportLedger);
router.put('/:id/reconcile', reconcileLedgerEntry);

export default router;

