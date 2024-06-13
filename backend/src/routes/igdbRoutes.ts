import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

interface ApiRequestBody {
  endpoint: string;
  body: string;
}

router.post('/games', async (req: Request, res: Response) => {
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

export default router;
