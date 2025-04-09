import { Consumer } from 'kafkajs'
import { ConfigKafka } from './configKafka.js';
import { Singleton } from "../singleton.js";
import StockModel from '../database/model/stock.model.js';
import { StockDto } from '../dto/stock.dto.js';
import { CategoryDto } from '../dto/category.dto.js';

export class ConsumerFactory {

  consumer: Consumer;

  constructor() {
    const kafka = new ConfigKafka().getKafkaConnection();
    this.consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID })
  }

  async run() {
    try {
      let fromBeginning = (/true/i).test(process.env.KAFKA_SUBSCRIBE_FROM_BEGINNING)

      await this.consumer.connect()
      await this.consumer.subscribe({ topic: process.env.KAFKA_TOPIC_CONSUMER, fromBeginning: fromBeginning })

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const webSocket = Singleton.getInstance().getWebSocket();

          if (webSocket && message) {
            const key = message.key.toString();
            const value = message.value.toString();

            //to-do check here       
            if (value === 'ERROR') {
              webSocket.send(value)
              console.error('We have an error for stock code ', key)
            } else {
              //to-do create method in util class
              var result = JSON.parse(value);

              const filter = {
                'stock.code': {
                  '$eq': key
                }
              };

              const update = {
                'stock.result': result
              };

              await StockModel.findOneAndUpdate(filter, update);

              const stock = await StockModel.findOne(filter); 

              const categoryDto = new CategoryDto(stock.name, stock.numberOfStocks);
              const stockDto = new StockDto(categoryDto, stock.stock.code, stock.stock.name, stock.stock.result);

              webSocket.send(JSON.stringify(stockDto));

              await StockModel.findOneAndDelete(filter, update);
            }

            await this.consumer.commitOffsets([{ topic, partition, offset: (Number(message.offset) + 1).toString() }]);

            Singleton.getInstance().addStockSentByWS();
            const totalNumberOfStocks = Singleton.getInstance().getTotalNumberOfStocks();
            const stocksSentByWS = Singleton.getInstance().getStocksSentByWS();

            //to-do check stocks in db with in kafka
            if (totalNumberOfStocks == stocksSentByWS) {
              webSocket.send('COMPLETED');
            }
          } else {
            console.log('WebSocket not connected and/or kafka message is empty');
          }
        }
      })
    } catch (error) {
      console.error(error);
    }
  }
}