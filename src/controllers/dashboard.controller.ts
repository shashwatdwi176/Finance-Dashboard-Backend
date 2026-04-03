import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { sendSuccess } from '../utils/response.util';

export const dashboardController = {
    /**
     * @swagger
     * /dashboard/summary:
     *   get:
     *     summary: Get total income, expense, and net balance (All roles)
     *     tags: [Dashboard]
     *     security: [{ BearerAuth: [] }]
     *     responses:
     *       200:
     *         description: Financial summary
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 totalIncome:
     *                   type: number
     *                 totalExpense:
     *                   type: number
     *                 netBalance:
     *                   type: number
     */
    async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const summary = await dashboardService.getSummary();
            sendSuccess(res, summary, 'Dashboard summary fetched');
        } catch (error) {
            next(error);
        }
    },

    /**
     * @swagger
     * /dashboard/category-breakdown:
     *   get:
     *     summary: Get totals grouped by category (All roles)
     *     tags: [Dashboard]
     *     security: [{ BearerAuth: [] }]
     *     responses:
     *       200:
     *         description: Category breakdown
     */
    async getCategoryBreakdown(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const breakdown = await dashboardService.getCategoryBreakdown();
            sendSuccess(res, breakdown, 'Category breakdown fetched');
        } catch (error) {
            next(error);
        }
    },

    /**
     * @swagger
     * /dashboard/trends:
     *   get:
     *     summary: Get monthly income and expense trends (All roles)
     *     tags: [Dashboard]
     *     security: [{ BearerAuth: [] }]
     *     responses:
     *       200:
     *         description: Monthly trends
     */
    async getTrends(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const trends = await dashboardService.getMonthlyTrends();
            sendSuccess(res, trends, 'Monthly trends fetched');
        } catch (error) {
            next(error);
        }
    },

    /**
     * @swagger
     * /dashboard/recent:
     *   get:
     *     summary: Get the 5 most recent transactions (All roles)
     *     tags: [Dashboard]
     *     security: [{ BearerAuth: [] }]
     *     responses:
     *       200:
     *         description: Recent transactions
     */
    async getRecent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const recent = await dashboardService.getRecentTransactions();
            sendSuccess(res, recent, 'Recent transactions fetched');
        } catch (error) {
            next(error);
        }
    },
};
