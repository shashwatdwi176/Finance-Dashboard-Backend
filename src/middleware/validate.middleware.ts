import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response.util';

type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Generic Zod validation middleware.
 * Usage: validate(mySchema, 'body')
 */
export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req[target]);

        if (!result.success) {
            const errors = (result.error as ZodError).errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            }));

            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors,
                statusCode: 400,
            });
            return;
        }

        // Overwrite with parsed / coerced values (e.g. number transforms)
        (req as Request & { [key in ValidationTarget]: unknown })[target] = result.data;
        next();
    };
}
