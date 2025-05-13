import express from 'express';
import {
    signIn,
    signUp,
    signOut,
    resetPassword,
    getCurrentUser,
    refreshToken,
    getUserById
} from './auth.controller';
import { authenticate } from '../middleware/auth.middleware';

export const authRouter = express.Router();

// Public auth routes
authRouter.post('/signin', signIn);
authRouter.post('/signup', signUp);
authRouter.post('/signout', signOut);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/referesh-token', refreshToken);

// Protected auth routes
authRouter.get('/me', authenticate, getCurrentUser);

// Admin auth routes
authRouter.get('/admin/users/:userId', authenticate, getUserById);
