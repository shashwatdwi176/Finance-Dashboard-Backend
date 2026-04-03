import { Router } from 'express';
import { recordController } from '../controllers/record.controller';
import { authenticate } from '../middleware/auth.middleware';
import { adminOnly, analystOrAdmin } from '../middleware/authorize.middleware';
import { validate } from '../middleware/validate.middleware';
import {
    createRecordSchema,
    updateRecordSchema,
    recordQuerySchema,
    idParamSchema,
} from '../utils/validation.schemas';

const router = Router();

// All record endpoints require valid JWT
router.use(authenticate);

// GET /records — ANALYST and ADMIN can view
router.get('/', analystOrAdmin, validate(recordQuerySchema, 'query'), recordController.getAll);

// GET /records/:id — ANALYST and ADMIN can view
router.get(
    '/:id',
    analystOrAdmin,
    validate(idParamSchema, 'params'),
    recordController.getById,
);

// POST /records — ADMIN only
router.post('/', adminOnly, validate(createRecordSchema), recordController.create);

// PATCH /records/:id — ADMIN only
router.patch(
    '/:id',
    adminOnly,
    validate(idParamSchema, 'params'),
    validate(updateRecordSchema),
    recordController.update,
);

// DELETE /records/:id — ADMIN only (soft delete)
router.delete(
    '/:id',
    adminOnly,
    validate(idParamSchema, 'params'),
    recordController.remove,
);

export default router;
