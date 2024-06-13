import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

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
app.post('/api/games', async (req: Request, res: Response) => {
  const { endpoint, body }: ApiRequestBody = req.body;

  const url = `https://api.igdb.com/v4/${endpoint}`;
  const headers = {
    'Accept': 'application/json',
    'Client-ID': process.env.IGDB_CLIENT_ID!,
    'Authorization': `Bearer ${process.env.IGDB_API_KEY!}`,
  };

  try {
    const response = await axios.post(url, body, { headers });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from IGDB:', (error as Error).message);
    res.status(500).json({ error: 'An error occurred while fetching data from IGDB' });
  }
});

// fallback handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});