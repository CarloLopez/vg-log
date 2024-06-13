const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/games', async (req, res) => {
  const { endpoint, body } = req.body;

  const url = `https://api.igdb.com/v4/${endpoint}`;
  const headers = {
    'Accept': 'application/json',
    'Client-ID': process.env.IGDB_CLIENT_ID,
    'Authorization': `Bearer ${process.env.IGDB_API_KEY}`,
  };

  try {
    const response = await axios.post(url, body, { headers });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from IGDB:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching data from IGDB' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
