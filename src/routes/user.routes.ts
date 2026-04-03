import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { adminOnly } from '../middleware/authorize.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateRoleSchema, updateStatusSchema, idParamSchema } from '../utils/validation.schemas';

const router = Router();

// All user management endpoints require authentication + ADMIN role
router.use(authenticate, adminOnly);

// GET /users
router.get('/', userController.getAllUsers);

// PATCH /users/:id/role
router.patch(
    '/:id/role',
    validate(idParamSchema, 'params'),
    validate(updateRoleSchema),
    userController.updateRole,
);

// PATCH /users/:id/status
router.patch(
    '/:id/status',
    validate(idParamSchema, 'params'),
    validate(updateStatusSchema),
    userController.updateStatus,
);

export default router;
