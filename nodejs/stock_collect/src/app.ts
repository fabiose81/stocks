import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import addRoutes from './router.js';
import { DbConfig } from './database/dbConfig.js';
import { Sender } from './websocket/sender.js';
import { ConsumerFactory } from './kafka/consumerFactory.js';

dotenv.config();

const PORT = process.env.SERVER_PORT;
const app: Express = express();

app.use(cors());

addRoutes(app);

async function main() {
  const dbConfig = new DbConfig();
  dbConfig.connect()
    .then(() => {
      const sender = new Sender();
      sender.connect();

      const consumer = new ConsumerFactory();
      consumer.run();

    }).catch(error => console.log(error));
}

app.listen(PORT, () => {
  main();

  return console.log(`Express is listening at http://localhost:${PORT}`);
});