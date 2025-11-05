require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const droneRoutes = require('./routes/drone');
const authRoutes = require('./routes/auth');
const app = express();

// Rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Too many requests, please try again later.' }
});

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(limiter);
app.use(express.json());
app.use('/', droneRoutes);

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Drone API Server running on port ${PORT}`);
  console.log('CONFIG_SERVER_URL:', process.env.CONFIG_SERVER_URL);
});