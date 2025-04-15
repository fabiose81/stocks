import express, { Express } from 'express';
import dotenv from 'dotenv';
import { DbConfig } from './database/dbConfig.js';
import { Sender } from './websocket/sender.js';
import { ConsumerFactory } from './kafka/consumerFactory.js';

dotenv.config();

const PORT = process.env.SERVER_PORT;
const app: Express = express();

async function main() {
  const dbConfig = new DbConfig();
  dbConfig.connect()
    .then(() => {
      const sender = new Sender();
      sender.connect();

      const consumer = new ConsumerFactory();
      consumer.run();

    }).catch(error => console.error(error));
}

app.listen(PORT, () => {
  main();

  return console.log(`Express is listening at http://localhost:${PORT}`);
});