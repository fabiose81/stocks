import OpenAI from 'openai';
import { ProducerFactory } from '../kafka/producerFactory.js';
import { Singleton } from "../singleton.js";
import { Constants } from '../constants.js';
import StockModel from '../database/model/stock.model.js';

export class GptClient {

   openAiClient: OpenAI;
   period: string;
   interval: string;

   constructor(period: any, interval: any) {
      const apiKey = process.env.OPENAI_API_KEY;
      this.openAiClient = new OpenAI({ apiKey });
      this.period = period;
      this.interval = interval;
   }

   async search() {
      try {
         const model = process.env.CHAT_GPT_MODEL;
         const content = process.env.CHAT_GPT_MESSAGE_CONTENT.replace('%s', this.period);

         const completion = await this.openAiClient.chat.completions.create({
            model: model,
            messages: [
               {
                  role: 'user',
                  content: content
               },
            ],
         });

         var response = completion.choices[0].message.content;
         if (response) {
            this.parseResponse(response);
         }
      } catch (error) {
         const webSocket = Singleton.getInstance().getWebSocket();
         if (webSocket) {
            webSocket.send(Constants.GPT_MESSAGE_COMPLETED)
         }
         console.error(error);
      }
   }

   private parseResponse(response) {
      const producer = new ProducerFactory();

      response = response.substring(
         response.indexOf("```json") + 7,
         response.lastIndexOf("```")
      );

      const result = JSON.parse(response);
      result.forEach((category) => {
         category.stocks.forEach((stock) => {
           this.saveResponse(category, stock, producer)
         });
      });
   }

   private saveResponse(category, stock, producer) {
      const stockModel = new StockModel({
         name: category.name,
         numberOfStocks: category.numberOfStocks,
         stock: {
            code: stock.code,
            name: stock.name,
         }
      })
      stockModel.save().then(() => {
         producer.send(stock.code, this.period, this.interval);
         Singleton.getInstance().addAmountOfStock();
      });
   }
}