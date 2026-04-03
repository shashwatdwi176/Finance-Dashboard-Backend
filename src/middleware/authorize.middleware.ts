import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

/**
 * RBAC Authorization middleware factory.
 *
 * Usage in routes:
 *   router.get('/path', authenticate, authorize([Role.ADMIN]), controller.method)
 *
 * Never put role checks inside controllers.
 */
export function authorize(allowedRoles: Role[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized', statusCode: 401 });
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
                statusCode: 403,
            });
            return;
        }

        next();
    };
}

// ─── Preset role guards (for readability) ────────────────────

/** Only ADMIN */
export const adminOnly = authorize([Role.ADMIN]);

/** ADMIN and ANALYST */
export const analystOrAdmin = authorize([Role.ANALYST, Role.ADMIN]);

/** VIEWER, ANALYST, ADMIN */
export const allRoles = authorize([Role.VIEWER, Role.ANALYST, Role.ADMIN]);
