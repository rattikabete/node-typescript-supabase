import { Request, Response } from 'express';
import { AppError } from './error.middleware';

export const notFoundHandler = (
    req: Request,
    res: Response,
): void => {
    throw new AppError(`Cannot find ${req.method} ${req.originalUrl}`, 404);
};