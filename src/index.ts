import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { logger } from './utils/logger';
import { authRouter } from './auth/auth.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);

app.get('/api/test', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'API is running!',
    });
});

app.use(errorHandler);

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});