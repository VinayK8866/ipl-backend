const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const redis = require('redis');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*", // Allow all origins (for development).  Restrict in production!
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.log('Redis Client Error', err);
});

app.use((req, res, next) => {
  req.redis = redisClient;
  next();
});

// Import and mount routes
const scoreRoutes = require('./routes/scoreRoutes');
app.use('/score', scoreRoutes);  // Mount the routes under the /score path

// Test
const axios = require('axios');
app.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5555/api/task/async-apply/tasks.scrape_data', {});
    res.send(`IPL Backend Server is running! Task submitted!`);
  } catch (e) {
    res.send(e.message);
  }
});

// Socket setup
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('ai_commentary', (commentary) => {
    console.log('Received AI commentary:', commentary);
    io.emit('new_ai_commentary', commentary);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});