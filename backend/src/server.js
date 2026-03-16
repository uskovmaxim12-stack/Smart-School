const http = require('http');
const app = require('./app');
const { setupWebSocket } = require('./websocket');
const pool = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// WebSocket server
setupWebSocket(server);

// Test DB connection
pool.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to PostgreSQL');
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
