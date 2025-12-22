import express from 'express';
import { authenticate, roleGuard } from '../middleware/auth.middleware.js';
import {
  getPendingAgents,
  getAllAgents,
  approveAgent,
  rejectAgent,
  getApprovedAgents,
  suspendAgent,
  reactivateAgent,
} from '../controllers/agentApproval.controller.js';

const router = express.Router();

// Public route - Get approved agents
router.get('/approved', getApprovedAgents);

// Admin routes
router.get('/pending', authenticate, roleGuard('admin'), getPendingAgents);
router.get('/', authenticate, roleGuard('admin'), getAllAgents);
router.put('/:id/approve', authenticate, roleGuard('admin'), approveAgent);
router.put('/:id/reject', authenticate, roleGuard('admin'), rejectAgent);
router.put('/:id/suspend', authenticate, roleGuard('admin'), suspendAgent);
router.put('/:id/reactivate', authenticate, roleGuard('admin'), reactivateAgent);

export default router;
