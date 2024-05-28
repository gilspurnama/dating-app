import htpp from 'http';
import express from 'express';
import logging from './config/logging';
import mongoose from 'mongoose';

import { loggingHandler } from './middleware/loggingHandler';
import { corsHandler } from './middleware/corsHandler';
import { SERVER_HOSTNAME, SERVER_PORT } from './config/config';
import routers from './routers';
import dotenv from 'dotenv';

dotenv.config();

export const app = express();
export let httpServer: ReturnType<typeof htpp.createServer>;
const MONGO_URL = process.env.DB_CONN_STRING;

export const startServer = async () => {
  logging.info('======================================');
  logging.info('Initialiazing API');
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  logging.info('Logging & Configuration');
  app.use(loggingHandler);
  app.use(corsHandler);

  logging.info('Start Server');
  httpServer = htpp.createServer(app);
  if (!process.env.DB_CONN_STRING) {
    throw new Error('mongo url not defined');
  }
  await mongoose
    .connect(process.env.DB_CONN_STRING)
    .then(() => logging.info('MongoDB is connected'))
    .catch((e) => logging.error(e));

  httpServer.listen(SERVER_PORT, () => {
    logging.info('Server Started: ' + SERVER_HOSTNAME + ': ' + SERVER_PORT);
    logging.info('======================================');
    app.use('/', routers());
  });
};

export const Shutdown = (callback: any) => httpServer && httpServer.close(callback);

startServer();
