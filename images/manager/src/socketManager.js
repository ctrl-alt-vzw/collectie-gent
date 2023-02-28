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
          s.send(topic);
        });
    }
  }
  async connect() {
    console.log("retrying to connect")

    this.server.on('connection', (ws) => {
      this.serverStats.connected = true;
      this.socketList.push(ws);
      console.log("connection made")
      ws.on('message', (data) => {
        if(data == "ping") {
          ws.send('pong', data);
        } else {
          const parsed = JSON.parse(data);
          if(parsed.type == "itemMove") {
            this.broadcast(JSON.stringify(parsed));
          }
        }
        // ws.send("clipping/added/c2352f83-7a3f-4361-8680-4891534fbbf8")
      });

    });


  }
}