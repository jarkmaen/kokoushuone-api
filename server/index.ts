import * as logger from "./utils/logger.js";
import app from "./app.js";
import { PORT } from "./utils/config.js";

const start = () => {
    const server = app.listen(PORT, () => {
        logger.info(`Palvelin on käytettävissä portissa ${PORT}`);
    });

    server.on("error", (error) => {
        logger.error("Tapahtui virhe palvelimen käynnistyksessä:", error);
        process.exit(1);
    });
};

start();
