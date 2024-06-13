import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import igdbRoutes from './routes/igdbRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// serve static files from the React app
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// interface for the request body
interface ApiRequestBody {
  endpoint: string;
  body: string;
}

// routes
app.use('/api', igdbRoutes);

// fallback handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});