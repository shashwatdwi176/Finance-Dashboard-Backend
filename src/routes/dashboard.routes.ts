import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';
import { allRoles } from '../middleware/authorize.middleware';

const router = Router();

// All dashboard endpoints: authenticated, all roles (VIEWER, ANALYST, ADMIN)
router.use(authenticate, allRoles);

// GET /dashboard/summary
router.get('/summary', dashboardController.getSummary);

// GET /dashboard/category-breakdown
router.get('/category-breakdown', dashboardController.getCategoryBreakdown);

// GET /dashboard/trends
router.get('/trends', dashboardController.getTrends);

// GET /dashboard/recent
router.get('/recent', dashboardController.getRecent);

export default router;
