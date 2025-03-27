import { ConsumerFactory } from './kafka/consumerFactory.js';
import { Sender } from './websocket/sender.js';
import { Collector } from './chatgpt/collector.js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.HTTP_PORT;
const app = express();

const consumer = new ConsumerFactory();
consumer.run();

// const sender = new Sender();
// sender.connect();

app.get('/', (req, res) => {
    const collector = new Collector();
    collector.search();
    res.send('Working in progress...');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});