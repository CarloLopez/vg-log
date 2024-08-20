import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './db';
import igdbRoutes from './routes/igdbRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

// connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// serve static files from React app
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// use routes
app.use('/api', igdbRoutes);
app.use('/users', userRoutes);

// for any request that doesn't match one above, send back React's index.html file
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
