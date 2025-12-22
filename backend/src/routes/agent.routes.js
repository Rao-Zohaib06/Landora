import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { roleGuard } from '../middleware/auth.middleware.js';
import {
  getMyLeads,
  getLeadById,
  createLead,
  updateLeadStatus,
  addLeadNote,
  updateLead,
  deleteLead,
} from '../controllers/lead.controller.js';
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notification.controller.js';

const router = express.Router();

router.use(authenticate);
router.use(roleGuard('agent'));

// Lead routes
router.get('/leads', getMyLeads);
router.get('/leads/:id', getLeadById);
router.post('/leads', createLead);
router.put('/leads/:id', updateLead);
router.put('/leads/:id/status', updateLeadStatus);
router.post('/leads/:id/notes', addLeadNote);
router.delete('/leads/:id', deleteLead);

// Notification routes
router.get('/notifications', getMyNotifications);
router.put('/notifications/:id/read', markAsRead);
router.put('/notifications/read-all', markAllAsRead);
router.delete('/notifications/:id', deleteNotification);

export default router;

