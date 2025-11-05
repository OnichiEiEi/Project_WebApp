const express = require('express');
const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const NodeCache = require('node-cache');
const router = express.Router();

const CONFIG_SERVER_URL = process.env.CONFIG_SERVER_URL;
const LOG_SERVER_URL = process.env.LOG_SERVER_URL;
const LOG_API_TOKEN = process.env.LOG_API_TOKEN;

const configCache = new NodeCache({ stdTTL: 60 });

// Retry logic
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    error.code === 'ECONNABORTED' || error.response?.status >= 500,
});

// GET /configs/:droneId
router.get('/configs/:droneId', async (req, res) => {
  const { droneId } = req.params;
  const cached = configCache.get(droneId);
  if (cached) return res.json(cached);

  try {
    const response = await axios.get(CONFIG_SERVER_URL, { timeout: 8000 });
    const droneList = response.data?.data;

    if (!Array.isArray(droneList)) {
      console.error('CONFIG format error:', response.data);
      return res.status(500).json({ error: 'Invalid config format' });
    }

    const drone = droneList.find(d => String(d.drone_id) === String(droneId));
    if (!drone) return res.status(404).json({ error: 'Drone not found' });

    const result = {
      drone_id: drone.drone_id,
      drone_name: drone.drone_name,
      light: drone.light,
      country: drone.country,
      weight: drone.weight
    };

    configCache.set(droneId, result);
    res.json(result);
  } catch (err) {
    console.error('CONFIG fetch error:', err.message, err.response?.data);
    res.status(500).json({ error: 'Failed to fetch config' });
  }
});

// GET /status/:droneId
router.get('/status/:droneId', async (req, res) => {
  try {
    const { droneId } = req.params;
    const response = await axios.get(CONFIG_SERVER_URL, { timeout: 8000 });
    const droneList = response.data?.data;

    if (!Array.isArray(droneList)) {
      console.error('CONFIG format error:', response.data);
      return res.status(500).json({ error: 'Invalid config format' });
    }

    const drone = droneList.find(d => String(d.drone_id) === String(droneId));
    if (!drone) return res.status(404).json({ error: 'Drone not found' });

    res.json({ condition: drone.condition });
  } catch (err) {
    console.error('STATUS fetch error:', err.message, err.response?.data);
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

// GET /logs/:droneId
router.get('/logs/:droneId', async (req, res) => {
  try {
    const { droneId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 12;

    const url = `${LOG_SERVER_URL}?filter=(drone_id='${droneId}')&sort=-created&page=${page}&perPage=${perPage}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${LOG_API_TOKEN}` },
      timeout: 10000
    });

    const items = response.data?.items?.map(({ drone_id, drone_name, created, country, celsius }) => ({
      drone_id,
      drone_name,
      created,
      country,
      celsius
    })) || [];

    const totalItems = response.data?.totalItems || 0;

    res.json({ items, totalItems });
  } catch (err) {
    const status = err.response?.status;
    const isTimeout = err.code === 'ECONNABORTED' || status === 524;

    console.error('LOGS fetch error:', err.message, err.response?.data || err.code);

    if (isTimeout) {
      return res.status(504).json({ error: 'Log server timeout. Please try again later.' });
    }

    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// POST /logs
router.post('/logs', async (req, res) => {
  try {
    const { drone_id, drone_name, country, celsius } = req.body;

    if (!drone_id || !drone_name || !country || celsius === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const payload = { drone_id, drone_name, country, celsius };

    const response = await axios.post(LOG_SERVER_URL, payload, {
      headers: { Authorization: `Bearer ${LOG_API_TOKEN}` },
      timeout: 10000
    });

    res.status(201).json(response.data);
  } catch (err) {
    console.error('LOG create error:', err.message, err.response?.data || err.code);

    const status = err.response?.status;
    const isTimeout = err.code === 'ECONNABORTED' || status === 524;

    if (isTimeout) {
      return res.status(504).json({ error: 'Log server timeout. Please try again later.' });
    }

    res.status(500).json({ error: 'Failed to create log' });
  }
});

module.exports = router;