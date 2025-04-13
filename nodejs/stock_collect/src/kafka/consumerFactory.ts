import { Consumer } from 'kafkajs'
import { ConfigKafka } from './configKafka.js';
import { Singleton } from "../singleton.js";
import StockModel from '../database/model/stock.model.js';
import { StockDto } from '../dto/stock.dto.js';
import { CategoryDto } from '../dto/category.dto.js';
import { Constants } from '../constants.js';

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

            if (value === Constants.KAFKA_MESSAGE_ERROR) {
              console.error('We have an error for stock code ', key)
            } else {
              var result = JSON.parse(value);
              this.updateStock(key, result, webSocket);
            }

            await this.consumer.commitOffsets([{ topic, partition, offset: (Number(message.offset) + 1).toString() }]);

            Singleton.getInstance().addAmountOfStockConsumed();
            const totalNumberOfStocks = Singleton.getInstance().getTotalNumberOfStocks();
            const stocksSentByWS = Singleton.getInstance().getStocksSentByWS();

            if (totalNumberOfStocks == stocksSentByWS) {
              const stocks = [];
              for await (const stock of StockModel.find({})) {
                  const categoryDto = new CategoryDto(stock.name);
                  const stockDto = new StockDto(categoryDto, stock.stock.code, stock.stock.name, stock.stock.result);
                  stocks.push(stockDto);
              }
              
              webSocket.send(JSON.stringify(stocks));
              webSocket.send(Constants.WS_MESSAGE_COMPLETED);
              Singleton.getInstance().setStocksSentByWS(0);
              Singleton.getInstance().setTotalNumberOfStocks(0);
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

  private async updateStock(key: string, result: any, webSocket: WebSocket) {
    const filter = {
      'stock.code': {
        '$eq': key
      }
    };

    const update = {
      'stock.result': result
    };

    await StockModel.findOneAndUpdate(filter, update);
  }
}