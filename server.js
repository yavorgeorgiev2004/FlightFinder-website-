const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 3000;
const API_KEY = 'd2e27a08557382081d80ed4268fbb552';

app.use(cors());

// Proxy endpoint for flight search
app.get('/api/flights', async (req, res) => {
  const { origin, destination, depart_date } = req.query;
  const url = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${origin}&destination=${destination}&depart_date=${depart_date}&currency=usd&token=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
