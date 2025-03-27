import { WebSocketServer } from 'ws';

export class Sender {

    connect() {
        const port = process.env.WS_PORT;
        const wss = new WebSocketServer({ port: port });

        wss.on('connection', function connection(ws) {
            ws.on('message', function message(data) {
              console.log('received: %s', data);
              ws.send('recebeva de volta tua porra:' + data);
            });
          
            ws.send('connected');
          });
    } 
}