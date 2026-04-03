import { Response } from 'express';

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    meta?: Record<string, unknown>;
    statusCode: number;
}

export function sendSuccess<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode = 200,
    meta?: Record<string, unknown>,
): Response {
    const response: ApiResponse<T> = {
        success: true,
        message,
        data,
        statusCode,
        ...(meta && { meta }),
    };
    return res.status(statusCode).json(response);
}

export function sendError(
    res: Response,
    message: string,
    statusCode = 500,
): Response {
    const response = {
        success: false,
        message,
        statusCode,
    };
    return res.status(statusCode).json(response);
}

export function sendCreated<T>(res: Response, data: T, message = 'Created successfully'): Response {
    return sendSuccess(res, data, message, 201);
}
