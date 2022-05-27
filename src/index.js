import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { router as authRouter } from './routes/authRouter.js';
import { router as userRouter } from './routes/userRouter.js';
import { errorMiddleware } from './middlewares/error-middleware.js';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL,
}));

app.use(cookieParser());
app.use(express.json());
app.use(authRouter)
app.use('/users', userRouter)
app.use(errorMiddleware);

app.listen(PORT)
