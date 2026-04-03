import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess, sendCreated } from '../utils/response.util';
import type { RegisterInput, LoginInput } from '../utils/validation.schemas';

export const authController = {
    /**
     * @swagger
     * /auth/register:
     *   post:
     *     summary: Register a new user
     *     tags: [Auth]
     *     security: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [email, password]
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *                 minLength: 8
     *     responses:
     *       201:
     *         description: User registered successfully
     *       400:
     *         description: Validation error
     *       409:
     *         description: Email already in use
     */
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const input = req.body as RegisterInput;
            const user = await authService.register(input);
            sendCreated(res, user, 'Registration successful');
        } catch (error) {
            next(error);
        }
    },

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Login and receive a JWT token
     *     tags: [Auth]
     *     security: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [email, password]
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Login successful
     *       401:
     *         description: Invalid credentials
     */
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const input = req.body as LoginInput;
            const result = await authService.login(input);
            sendSuccess(res, result, 'Login successful');
        } catch (error) {
            next(error);
        }
    },

    /**
     * @swagger
     * /auth/me:
     *   get:
     *     summary: Get current authenticated user profile
     *     tags: [Auth]
     *     responses:
     *       200:
     *         description: Current user info
     *       401:
     *         description: Unauthorized
     */
    async me(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await authService.getUserById(req.user!.id);
            sendSuccess(res, user);
        } catch (error) {
            next(error);
        }
    },
};
