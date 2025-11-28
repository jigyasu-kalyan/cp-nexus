import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import teamRoutes from './routes/team.routes';
import profileRoutes from './routes/profile.routes';
import dashboardRouter from "./routes/dashboard.routes";
import cookieParser from 'cookie-parser';

const app: Express = express();


// All middlewares
// CORS configuration - Allow all origins
app.use(cors({
    origin: true, // Allow all origins
    credentials: true, // Allow cookies/credentials to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Test route
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP', message: 'CP-Nexus API is running' });
});


// API routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', teamRoutes);
app.use('/api/v1', profileRoutes);
app.use('/api/v1', dashboardRouter);

export default app;