import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from './routes/auth.routes';

const app: Express = express();


// All middlewares
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Test route
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP', message: 'CP-Nexus API is running' });
});


// API routes
app.use('/api/v1', authRoutes);

export default app;