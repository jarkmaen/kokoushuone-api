import * as logger from "./utils/logger.js";
import app from "./app.js";
import { PORT } from "./utils/config.js";

const start = () => {
    const server = app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });

    server.on("error", (error) => {
        logger.error("Failed to start the server:", error);
        process.exit(1);
    });
};

start();
