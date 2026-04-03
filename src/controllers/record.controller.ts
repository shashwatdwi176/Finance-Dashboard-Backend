import { Request, Response, NextFunction } from 'express';
import { recordService } from '../services/record.service';
import { sendSuccess, sendCreated } from '../utils/response.util';
import type { CreateRecordInput, UpdateRecordInput, RecordQueryInput } from '../utils/validation.schemas';

export const recordController = {
    /**
     * @swagger
     * /records:
     *   get:
     *     summary: Get financial records with filtering and pagination (ANALYST, ADMIN)
     *     tags: [Records]
     *     security: [{ BearerAuth: [] }]
     *     parameters:
     *       - in: query
     *         name: type
     *         schema:
     *           type: string
     *           enum: [INCOME, EXPENSE]
     *       - in: query
     *         name: category
     *         schema:
     *           type: string
     *       - in: query
     *         name: from
     *         schema:
     *           type: string
     *           format: date
     *       - in: query
     *         name: to
     *         schema:
     *           type: string
     *           format: date
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 10
     *           maximum: 100
     *     responses:
     *       200:
     *         description: Paginated list of records
     */
    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query as unknown as RecordQueryInput;
            const { page, limit, ...filters } = query;
            const result = await recordService.getRecords(filters, { page, limit });
            sendSuccess(res, result.data, 'Records fetched successfully', 200, result.meta as Record<string, unknown>);
        } catch (error) {
            next(error);
        }
    },

    /**
     * @swagger
     * /records/{id}:
     *   get:
     *     summary: Get a single financial record (ANALYST, ADMIN)
     *     tags: [Records]
     *     security: [{ BearerAuth: [] }]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Financial record
     *       404:
     *         description: Not found
     */
    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const record = await recordService.getRecordById(req.params.id);
            sendSuccess(res, record);
        } catch (error) {
            next(error);
        }
    },

    /**
     * @swagger
     * /records:
     *   post:
     *     summary: Create a financial record (ADMIN only)
     *     tags: [Records]
     *     security: [{ BearerAuth: [] }]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [userId, amount, type, category, date]
     *             properties:
     *               userId:
     *                 type: string
     *               amount:
     *                 type: number
     *               type:
     *                 type: string
     *                 enum: [INCOME, EXPENSE]
     *               category:
     *                 type: string
     *               date:
     *                 type: string
     *                 format: date
     *               notes:
     *                 type: string
     *     responses:
     *       201:
     *         description: Record created
     */
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const input = req.body as CreateRecordInput;
            const record = await recordService.createRecord(input);
            sendCreated(res, record, 'Record created successfully');
        } catch (error) {
            next(error);
        }
    },

    /**
     * @swagger
     * /records/{id}:
     *   patch:
     *     summary: Update a financial record (ADMIN only)
     *     tags: [Records]
     *     security: [{ BearerAuth: [] }]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               amount:
     *                 type: number
     *               type:
     *                 type: string
     *                 enum: [INCOME, EXPENSE]
     *               category:
     *                 type: string
     *               date:
     *                 type: string
     *               notes:
     *                 type: string
     *     responses:
     *       200:
     *         description: Record updated
     */
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const input = req.body as UpdateRecordInput;
            const record = await recordService.updateRecord(req.params.id, input);
            sendSuccess(res, record, 'Record updated successfully');
        } catch (error) {
            next(error);
        }
    },

    /**
     * @swagger
     * /records/{id}:
     *   delete:
     *     summary: Soft-delete a financial record (ADMIN only)
     *     tags: [Records]
     *     security: [{ BearerAuth: [] }]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Record deleted
     *       404:
     *         description: Not found
     */
    async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await recordService.deleteRecord(req.params.id);
            sendSuccess(res, null, 'Record deleted successfully');
        } catch (error) {
            next(error);
        }
    },
};
