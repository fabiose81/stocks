import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import { ConsumerFactory } from './kafka/consumerFactory.js';
import addRoutes from './router.js';

dotenv.config();

const port = process.env.PORT;
const app: Express = express();

app.use(cors());

addRoutes(app);

const consumer = new ConsumerFactory();
consumer.run();

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});