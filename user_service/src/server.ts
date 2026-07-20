import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { connectRedis } from "./config/redis";

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    app.listen(env.PORT, () => {
      console.log(`User Service running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();