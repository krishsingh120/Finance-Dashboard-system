const Redis = require('ioredis')
const { REDIS_URL } = require('./serverConfig')

let redisClient

const connectRedis = async () => {
  try {
    redisClient = new Redis(REDIS_URL)

    redisClient.on('connect', () => {
      console.log('Redis connected')
    })

    redisClient.on('error', (error) => {
      console.error(`Redis error: ${error.message}`)
      process.exit(1)
    })
  } catch (error) {
    console.error(`Redis connection error: ${error.message}`)
    process.exit(1)
  }
}

const getRedisClient = () => {
  if (!redisClient) throw new Error('Redis not initialized')
  return redisClient
}

module.exports = { connectRedis, getRedisClient }