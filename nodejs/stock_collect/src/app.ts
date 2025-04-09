import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import addRoutes from './router.js';
import { DbConfig } from './database/dbConfig.js';
import { Sender } from './websocket/sender.js';
import { ConsumerFactory } from './kafka/consumerFactory.js';
import { Singleton } from './singleton.js';
import StockModel from './database/model/stock.model.js';

dotenv.config();

const PORT = process.env.SERVER_PORT;
const app: Express = express();

app.use(cors());

addRoutes(app);

async function initSingleton() {
  const stockModel = await StockModel.aggregate([
    {
      $group: {
        _id: null,
        totalNumberOfStocks: { $sum: "$numberOfStocks" }
      }
    }
  ]);

  const totalNumberOfStocks = stockModel[0]?.totalNumberOfStocks || 0;
  Singleton.getInstance().setTotalNumberOfStocks(totalNumberOfStocks);
}

async function main() {
  const dbConfig = new DbConfig();
  dbConfig.connect()
    .then(() => {
      const sender = new Sender();
      sender.connect();

      const consumer = new ConsumerFactory();
      consumer.run();

      //to-do check this method
      initSingleton();
    }).catch(error => console.log(error));
}

//to-do review env file and in docker-compose
app.listen(PORT, () => {
  main();

  return console.log(`Express is listening at http://localhost:${PORT}`);
});