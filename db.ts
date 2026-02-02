import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 6379,
    password: process.env.DB_PASSWORD,
    db: process.env.DB_INDEX ? Number(process.env.DB_INDEX) : 0,
};

const redis = new Redis(redisConfig);

redis.once('connect', () => {
    console.log('Connected to Redis');
});

// Keep .on for errors so you know if things break later
redis.on('error', (err) => {
    console.error('Redis Error:', err);
});
export default redis;