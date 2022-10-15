import WebSocket, { WebSocketServer } from 'ws';


export default class SocketManager {
  constructor(id, callback) {
    this.id = id;
    this.callback = callback;
    this.server = new WebSocketServer({
      port: 3001
    });

    this.socketList = [];

    this.serverStats = {
      connected: false
    }

  }
  async broadcast(topic, message, override = null) {
    if(this.serverStats.connected) {
      
        this.socketList.forEach((s) => {
          s.send(topic, message);
        });
    }
  }
  async connect() {
    console.log("retrying to connect")

    this.server.on('connection', (ws) => {
      this.serverStats.connected = true;
      this.socketList.push(ws);
      console.log("connection made")
      ws.on('message', function message(data) {
        console.log('received: %s', data);
        // ws.send("clipping/added/c2352f83-7a3f-4361-8680-4891534fbbf8")
      });

      ws.on('ping', function message(data) {
        ws.send('pong', data);
      });

    });


  }
}