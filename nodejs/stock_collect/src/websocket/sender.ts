import { WebSocketServer, WebSocket } from 'ws';
import { GptClient } from '../chatgpt/gptClient.js';
import { Singleton } from "../singleton.js";
import StockModel from '../database/model/stock.model.js';

export class Sender {

  webSocketServer: WebSocketServer;
  webSocket: WebSocket;
  
  constructor() {
    this.webSocketServer = new WebSocketServer({ port: process.env.WEBSOCKET_PORT });
  }

  connect() {
    this.webSocketServer.on('connection', (ws) => {
      Singleton.getInstance().setWebSocket(ws);

      console.log('Client connected ');

      ws.on('message', (message) => {
        const jSonMessage = JSON.parse(message)
        const period = jSonMessage.period;
        const interval = jSonMessage.interval;

        StockModel.deleteMany({ numberOfStocks: { $gte: 0 } })
          .then(() => {                    
            const gptClient = new GptClient(period, interval);
            gptClient.search();
          })
          .catch(error => {
            console.error('Error deleting users:', error);
          });
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  }
}