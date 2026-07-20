import app from "./app";
import { env } from "./config/env";
import { connectRedis } from "./config/redis";
import { verifyMailConnection } from "./config/mail";
import { Logger } from "./utils/logger";

async function startServer() {
    try {
        await connectRedis();
        await verifyMailConnection();

        app.listen(env.PORT, () => {
            Logger.success(`Email Service running on port ${env.PORT}`);
        });
    } catch (error) {
        Logger.error("Failed to start Email Service:", error);
        process.exit(1);
    }
}

startServer();