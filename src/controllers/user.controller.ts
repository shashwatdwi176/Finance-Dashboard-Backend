import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { sendSuccess } from '../utils/response.util';
import type { UpdateRoleInput, UpdateStatusInput } from '../utils/validation.schemas';

export const userController = {
    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Get all users (ADMIN only)
     *     tags: [Users]
     *     security: [{ BearerAuth: [] }]
     *     responses:
     *       200:
     *         description: List of all users
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await userService.getAllUsers();
            sendSuccess(res, users, 'Users fetched successfully');
        } catch (error) {
            next(error);
        }
    },

    /**
     * @swagger
     * /users/{id}/role:
     *   patch:
     *     summary: Update user role (ADMIN only)
     *     tags: [Users]
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
     *               role:
     *                 type: string
     *                 enum: [VIEWER, ANALYST, ADMIN]
     *     responses:
     *       200:
     *         description: Role updated
     *       404:
     *         description: User not found
     */
    async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { role } = req.body as UpdateRoleInput;
            const user = await userService.updateRole(id, role);
            sendSuccess(res, user, 'Role updated successfully');
        } catch (error) {
            next(error);
        }
    },

    /**
     * @swagger
     * /users/{id}/status:
     *   patch:
     *     summary: Enable or disable a user (ADMIN only)
     *     tags: [Users]
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
     *               status:
     *                 type: string
     *                 enum: [ACTIVE, INACTIVE]
     *     responses:
     *       200:
     *         description: Status updated
     */
    async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { status } = req.body as UpdateStatusInput;
            const user = await userService.updateStatus(id, status);
            sendSuccess(res, user, 'Status updated successfully');
        } catch (error) {
            next(error);
        }
    },
};
