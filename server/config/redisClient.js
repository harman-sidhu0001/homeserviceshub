import dotenv from "dotenv";
dotenv.config();

//For local development
// import Redis from "ioredis";

// const redis = new Redis({
//   host: "127.0.0.1",
//   port: 6379,
//   // password, db, tls etc. if needed
// });

// export default redis;

//For production
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);
export default redis;
