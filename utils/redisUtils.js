// utils/redisUtils.js
const getScore = async (redisClient, key) => {
  try {
    const score = await redisClient.get(key);
    return score ? JSON.parse(score) : null;
  } catch (err) {
    console.error(`Error getting ${key} from Redis:`, err);
    return null;
  }
};

const setScore = async (redisClient, key, data, io) => {  // Add io parameter
  try {
    await redisClient.set(key, JSON.stringify(data));
    console.log(`Set ${key} in Redis`);
    io.emit('scoreUpdate', data); // Emit to all connected clients
  } catch (err) {
    console.error(`Error setting ${key} in Redis:`, err);
  }
};

module.exports = { getScore, setScore };