import app from "./app";
import { env } from "./config/env";

async function startServer() {
    try {
        app.listen(env.PORT, () => {
            console.log(`Email Service running on port ${env.PORT}`);
        });
    } catch (error) {
        console.error("Failed to start Email Service:", error);
        process.exit(1);
    }
}

startServer();