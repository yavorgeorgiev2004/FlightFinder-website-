// Express.js server setup
// Source: https://expressjs.com/en/starter/hello-world.html
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 3000;
const API_KEY = 'd2e27a08557382081d80ed4268fbb552';
// Enable CORS for all routes to allow frontend requests
// Source: https://expressjs.com/en/resources/middleware/cors.html
app.use(cors());

// Proxy endpoint for flight search
// Express route handler with query parameter extraction
// Source: https://expressjs.com/en/guide/routing.html
// Async route handler allows use of await for cleaner promise handling
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
app.get('/api/flights', async (req, res) => {
  const { origin, destination, depart_date } = req.query;
  const url = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${origin}&destination=${destination}&depart_date=${depart_date}&currency=usd&token=${API_KEY}`;
  // Error handling with try-catch and appropriate HTTP status codes
  // Source: https://expressjs.com/en/guide/error-handling.html
  try {
    // Make HTTP request using node-fetch (brings browser fetch API to Node.js)
    // Source: https://github.com/node-fetch/node-fetch
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});


// Proxy endpoint for Travelpayouts API (for frontend flight search)
app.get('/api/travelpayouts/flights', async (req, res) => {
  const { origin, destination, departure_at } = req.query;
  if (!origin || !destination || !departure_at) {
    return res.status(400).json({ error: 'Missing required query parameters.' });
  }
  const url = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${origin}&destination=${destination}&depart_date=${departure_at}&currency=usd&token=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flights from Travelpayouts.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
