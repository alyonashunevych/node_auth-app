/* eslint-disable no-console */
'use strict';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { authRouter } from './routes/auth.router.ts';
import { errorMiddleware } from './middlewares/errorMiddleware.ts';
import { userRouter } from './routes/user.router.ts';
import { authMiddleware } from './middlewares/authMiddleware.ts';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());

app.use('/auth', authRouter);
app.use('/profile', authMiddleware, userRouter);

app.use(errorMiddleware);

app.listen(PORT, () => console.log('Server is running'));
