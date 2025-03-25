import { ProducerFactory } from './kafka/producerFactory.js';
import { ConsumerFactory } from './kafka/consumerFactory.js';
import express from 'express';

const app = express();
const port = 3000;

const consumer = new ConsumerFactory();
consumer.run();

app.get('/', (req, res) => {
    const producer = new ProducerFactory();
    producer.send('^BVSP');
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});