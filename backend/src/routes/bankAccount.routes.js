import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { roleGuard } from '../middleware/auth.middleware.js';
import {
  getAllBankAccounts,
  getBankAccountById,
  createBankAccount,
  updateBankAccount,
  uploadBankStatement,
  matchTransaction,
  getUnmatchedTransactions,
  getBankAccountLedger,
} from '../controllers/bankAccount.controller.js';

const router = express.Router();

router.use(authenticate);
router.use(roleGuard('admin'));

router.get('/', getAllBankAccounts);
router.get('/:id', getBankAccountById);
router.post('/', createBankAccount);
router.put('/:id', updateBankAccount);
router.post('/:id/upload-statement', uploadBankStatement);
router.post('/:accountId/transactions/:transactionId/match', matchTransaction);
router.get('/:accountId/unmatched', getUnmatchedTransactions);
router.get('/:id/ledger', getBankAccountLedger);

export default router;

