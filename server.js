const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

console.log('✅ Server file loaded');

// Test route - welcome message
app.get('/', (req, res) => {
  res.json({ message: '🎉 Finance Tracker API is running!', status: 'success' });
});

// Test route to check server status
app.get('/api/status', (req, res) => {
  res.json({ server: 'running', time: new Date().toLocaleString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Test the API at http://localhost:${PORT}/api/status`);
});