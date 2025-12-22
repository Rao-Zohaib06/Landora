import express from 'express';
import {
  calculateConstructionCost,
  calculateHomeLoan,
  convertAreaUnit,
  getConstructionRates,
} from '../controllers/calculator.controller.js';

const router = express.Router();

// Public routes - calculators don't require authentication
router.post('/construction-cost', calculateConstructionCost);
router.post('/home-loan', calculateHomeLoan);
router.post('/area-converter', convertAreaUnit);
router.get('/construction-rates', getConstructionRates);

export default router;

