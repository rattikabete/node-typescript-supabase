import { Request, Response, NextFunction } from 'express';
import { supabaseClient } from '../config/supabase';
import { EdgeFunctionRequest } from './edge.types';
import { AppError } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

export const invokeEdgeFunction = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { functionName, payload }: EdgeFunctionRequest = req.body;

        if (!functionName) {
            throw new AppError('Function name is required.', 400);
        }

        logger.info(`Invoking edge function: ${functionName}`, { payload });

        const { data, error } = await supabaseClient.functions.invoke(functionName, {
            body: payload || {},
            headers: req.headers.authorization ? {
                Authrization: req.headers.authorization,
            }: undefined,
        });

        if (error) {
            throw new AppError(`Edge function ${functionName} failed.`, 400);
        }

        res.status(200).json({
            success: true,
            data,
            message: 'Edge function invoked successfully.',
        });
    } catch (err) {
        next(err);
    }
}