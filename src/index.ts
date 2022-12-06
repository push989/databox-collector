import express from "express";
import dotenv from "dotenv";
dotenv.config();

import apiRouter from "./routes";
import { appConfig } from "./appConfig";
import startProcessors from "./processors";
import errorHandler from "./middleware/ErrorHandler";

if (appConfig.server) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/api/v1", apiRouter);

  app.use(errorHandler);

  app.listen(appConfig.port, () => {
    console.log(`Server started on port ${appConfig.port}`);
  });
}

if (appConfig.processor) {
  startProcessors();
}
