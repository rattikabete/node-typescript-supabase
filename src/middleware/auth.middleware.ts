import { Request, Response, NextFunction } from 'express';
import { User } from '@supabase/supabase-js';
import { supabaseClient } from '../config/supabase';
import { AppError } from './error.middleware';
import { logger } from '../utils/logger';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: User;
            token?: string;
        }
    }
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Missing or invalid authroization token.', 401);
        }

        const token = authHeader.split(' ')[1];
        const { data, error } = await supabaseClient.auth.getUser(token);

        if (error || !data.user) {
            throw new AppError('Invalid or expired token.', 401);
        }

        req.user = data.user;
        req.token = token;

        next();
    } catch (err) {
        if (err instanceof AppError) {
            next(err);
        } else {
            logger.error('Authentication error:', err);
            next(new AppError('Authentication failed.', 401));
        }
    }
};