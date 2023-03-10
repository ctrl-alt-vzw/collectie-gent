import { Server } from "socket.io";


export default class SocketManager {
  constructor(id, callback) {
    this.id = id;
    this.callback = callback;
    this.server = new Server(3001, {
      cors: {
        origin: '*',
      }
    });

    this.socketList = [];

    this.serverStats = {
      connected: false
    }

  }
  async broadcast(topic, message, override = null) {
    if(this.serverStats.connected) {
      
        this.socketList.forEach((s) => {
          s.emit(topic, message);
        });
    }
  }
  async connect() {
    console.log("retrying to connect")
  
    this.server.on("connection", (socket) => {
      this.serverStats.connected = true;

      console.log("someone connected")
      
      this.socketList.push(socket);
      
      socket.emit("ping", { addr: "manager"})
     

      socket.on('message', (data) => {
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
    })


  }
}