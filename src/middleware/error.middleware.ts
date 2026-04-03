import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.util';
import { logger } from '../utils/logger';

/**
 * Global error handler — catches all errors thrown/passed to next().
 * Must be registered LAST in the middleware chain.
 */
export function errorHandler(
    error: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction,
): void {
    if (error instanceof AppError) {
        // Operational / expected errors
        if (error.statusCode >= 500) {
            logger.error({ err: error, req: { method: req.method, url: req.url } }, error.message);
        } else {
            logger.warn({ statusCode: error.statusCode, url: req.url }, error.message);
        }

        res.status(error.statusCode).json({
            message: error.message,
            statusCode: error.statusCode,
        });
        return;
    }

    // Unexpected / programming errors
    logger.error({ err: error, req: { method: req.method, url: req.url } }, 'Unhandled error');

    res.status(500).json({
        message: 'Internal Server Error',
        statusCode: 500,
    });
}

/**
 * 404 handler — catches unmatched routes.
 */
export function notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({
        message: `Cannot ${req.method} ${req.url}`,
        statusCode: 404,
    });
}
