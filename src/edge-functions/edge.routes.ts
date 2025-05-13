import express from 'express';
import { invokeEdgeFunction } from './edge.controller';
import { authenticate } from '../middleware/auth.middleware';

export const edgeFunctionsRouter = express.Router();

edgeFunctionsRouter.post('/invoke', authenticate, invokeEdgeFunction);