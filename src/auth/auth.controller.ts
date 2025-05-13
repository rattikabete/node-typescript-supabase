import { Request, Response, NextFunction } from 'express';
import { supabaseClient, supabaseAdmin } from '../config/supabase';
import {
    SignUpRequest,
    SignInRequest,
    ResetPasswordRequest,
    AuthResponse,
    RefreshTokenRequest
} from './auth.types';
import { AppError } from '../middleware/error.middleware';
// import { logger } from '../utils/logger';

export const signIn = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password }: SignInRequest = req.body;

        if (!email || !password) {
            throw new AppError('Email and password are required.', 400);
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            throw new AppError(error.message, 400);
        }

        const response: AuthResponse = {
            user: data.user,
            session: data.session,
            error: null
        };

        res.status(200).json({
            success: true,
            data: response,
            message: 'User signed in successfully.'
        });
    } catch (err) {
        next(err);
    }
};

export const signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password, metadata }: SignUpRequest = req.body;

        if (!email || !password) {
            throw new AppError('Email and password are required.', 400);
        }

        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });

        if (error) {
            throw new AppError(error.message, 400);
        }

        const response: AuthResponse = {
            user: data.user,
            session: data.session,
            error: null
        };

        res.status(201).json({
            success: true,
            data: response,
            message: 'User created successfully.'
        });
    } catch (err) {
        next(err);
    }
};

export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email }: ResetPasswordRequest = req.body;

        if (!email) {
            throw new AppError('Email is required.', 400);
        }

        const { error } = await supabaseClient.auth.resetPasswordForEmail(email);

        if (error) {
            throw new AppError(error.message, 400);
        }

        res.status(200).json({
            success: true,
            message: 'Password reset link sent to the email'
        });
    } catch (err) {
        next(err);
    }
};

export const signOut = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            throw new AppError(error.message, 400);
        }

        res.status(200).json({
            success: true,
            message: 'Successfully signed out.'
        });
    } catch (err) {
        next(err);
    }
};

export const getCurrentUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated.', 401);
        }

        res.status(200).json({
            success: true,
            data: { user: req.user },
        });
    } catch (err) {
        next(err);
    }
};

export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { refreshToken }: RefreshTokenRequest = req.body;

        if (!refreshToken) {
            throw new AppError('Refresh token is required.', 400);
        }

        const { data, error } = await supabaseClient.auth.refreshSession({
            refresh_token: refreshToken
        });

        if (error) {
            throw new AppError(error.message, 400);
        }

        res.status(200).json({
            success: true,
            data: {
                session: data.session,
                user: data.user,
            },
            message: 'Token refreshed successfully.',
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Admin controller to get user by ID
 * (Protected with service role key)
 */
export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userId } = req.params;

        if (!userId) {
            throw new AppError('User ID is required.', 400);
        }

        const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

        if (error) {
            throw new AppError(error.message, 400);
        }

        if (!data.user) {
            throw new AppError('User not found.', 404);
        }

        res.status(200).json({
            success: true,
            data: { user: data.user },
        });
    } catch (err) {
        next(err);
    }
};