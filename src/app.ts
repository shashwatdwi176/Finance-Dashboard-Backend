import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

import { env } from './config/env.config';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { swaggerConfig } from './config/swagger.config';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import recordRoutes from './routes/record.routes';
import dashboardRoutes from './routes/dashboard.routes';

export const createApp = (): Application => {
    const app = express();

    // Support reverse proxies
    app.set('trust proxy', 1);

    // Standard middleware
    app.use(helmet());
    app.use(cors());
    app.use(compression());
    app.use(express.json());

    // Rate limiting
    const limiter = rateLimit({
        windowMs: env.RATE_LIMIT_WINDOW_MS,
        max: env.RATE_LIMIT_MAX,
        message: { success: false, message: 'Too many requests from this IP' },
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use('/api', limiter);

    // API Documentation
    const swaggerSpec = swaggerJsDoc(swaggerConfig);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/api-docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    // Routes
    app.use('/auth', authRoutes);
    app.use('/users', userRoutes);
    app.use('/records', recordRoutes);
    app.use('/dashboard', dashboardRoutes);

    // Health check
    app.get('/health', (req: Request, res: Response) => {
        res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // 404 handler
    app.use(notFoundHandler);

    // Global error handler
    app.use(errorHandler);

    return app;
};
