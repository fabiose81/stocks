import { WebSocketServer, WebSocket } from 'ws';
import { GptClient } from '../chatgpt/gptClient.js';
import { Singleton } from "../singleton.js";

export class Sender {

  wss: WebSocketServer;
  ws: WebSocket;

  constructor() {
    this.wss = new WebSocketServer({ port: 8080 });
  }

  connect() {
    this.wss.on('connection', (ws) => {
      Singleton.getInstance().setWebSocket(ws);

      //to-do check if there is message on stack
      console.log('New client connected ');
      
      // Sending a message to the client
      ws.send('Welcome to the WebSocket server!');


      ws.on('message', (message) => {
        const jSonMessage = JSON.parse(message)
        const period = jSonMessage.period;
        const interval = jSonMessage.interval;

        const gptClient = new GptClient(period, interval);
        gptClient.search();
      });

      // Handling client disconnection
      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  }

  close() {
    // Handling client disconnection
    this.ws.on('close', () => {
      console.log('Client disconnected');
    });
  }

}