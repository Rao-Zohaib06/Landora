import express from 'express';
import {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  approveListing,
  rejectListing,
  addInquiry,
} from '../controllers/listing.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { roleGuard } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getListings);
router.get('/:id', getListing);
router.post('/', authenticate, roleGuard('agent', 'admin'), createListing);
router.put('/:id', authenticate, updateListing);
router.delete('/:id', authenticate, deleteListing);
router.put('/:id/approve', authenticate, roleGuard('admin'), approveListing);
router.put('/:id/reject', authenticate, roleGuard('admin'), rejectListing);
router.post('/:id/inquiry', addInquiry);

export default router;

