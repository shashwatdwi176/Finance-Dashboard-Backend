import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { env } from '../config/env.config';

// ─── Augment Express Request ─────────────────────────────────
declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }
    }
}

export interface AuthenticatedUser {
    id: string;
    email: string;
    role: Role;
}

export interface JwtPayload {
    sub: string;
    email: string;
    role: Role;
    iat: number;
    exp: number;
}

/**
 * Authentication middleware.
 * Verifies JWT and attaches decoded user to req.user.
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'No token provided', statusCode: 401 });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
        req.user = { id: decoded.sub, email: decoded.email, role: decoded.role };
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: 'Token expired', statusCode: 401 });
            return;
        }
        res.status(401).json({ message: 'Invalid token', statusCode: 401 });
    }
}
