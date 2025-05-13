import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
): void => {
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    const statusCode = (err as AppError).statusCode || 500;
    const message = (err as AppError).isOperational
        ? err.message
        : 'Internal Server Error';
    
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.Node_ENV === 'development' && { stack: err.stack }),
    });
};