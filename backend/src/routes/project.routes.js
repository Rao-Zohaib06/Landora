import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getAllProjectsAdmin,
} from '../controllers/project.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { roleGuard } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/admin/all', authenticate, roleGuard('admin'), getAllProjectsAdmin);
router.get('/:id', getProject);
router.post('/', authenticate, roleGuard('admin'), createProject);
router.put('/:id', authenticate, roleGuard('admin'), updateProject);
router.delete('/:id', authenticate, roleGuard('admin'), deleteProject);

export default router;

