// routes/scoreRoutes.js
const express = require('express');
const router = express.Router();
const { getScore } = require('../utils/redisUtils');

// Get live score
router.get('/live', async (req, res) => {
  try {
    const score = await getScore(req.redis, 'ipl_score');
    if (score) {
      res.json(score);
    } else {
      res.status(404).json({ message: 'Live score not available.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching live score.' });
  }
});

// (Optional) Mock historical data endpoint
router.get('/historical', (req, res) => {
  // In a real application, this would fetch data from a database
  const historicalData = [
    { matchId: 1, date: '2024-03-22', team1: 'Team A', team2: 'Team B', score: '150/5' },
    { matchId: 2, date: '2024-03-23', team1: 'Team C', team2: 'Team D', score: '180/3' }
  ];
  res.json(historicalData);
});

module.exports = router;