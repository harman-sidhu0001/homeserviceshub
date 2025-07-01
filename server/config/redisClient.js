import Redis from "ioredis";

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  // password, db, tls etc. if needed
});

export default redis;

// import { createClient } from "redis";

// export const redisClient = createClient({
//   url: process.env.REDIS_URL || "redis://localhost:6379",
// });
// await redisClient.connect();

// redisClient.on("error", (err) => console.error("Redis Client Error", err));
