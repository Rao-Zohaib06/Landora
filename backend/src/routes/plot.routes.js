import express from 'express';
import {
  getPlots,
  getPlot,
  createPlot,
  updatePlot,
  deletePlot,
  assignBuyer,
  transferPlot,
} from '../controllers/plot.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { roleGuard } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getPlots);
router.get('/:id', getPlot);
router.post('/', authenticate, roleGuard('admin'), createPlot);
router.put('/:id', authenticate, roleGuard('admin'), updatePlot);
router.delete('/:id', authenticate, roleGuard('admin'), deletePlot);
router.post('/:id/assign-buyer', authenticate, roleGuard('admin'), assignBuyer);
router.post('/:id/transfer', authenticate, roleGuard('admin'), transferPlot);

export default router;

