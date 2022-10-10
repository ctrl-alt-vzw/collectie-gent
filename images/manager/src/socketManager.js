import { Server} from "socket.io";


export default class SocketManager {
  constructor(id, callback) {
    this.id = id;
    this.callback = callback;
    this.server = new Server(3001,{
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.socketList = [];

    this.serverStats = {
      connected: false
    }

  }
  async broadcast(topic, message, override = null) {
    if(this.clientStats.connected) {
      
        this.socketList.forEach((s) => {
          s.emit(topic, message);
        });
    }
  }
  async connect() {
    console.log("retrying to connect")
  
    this.server.on("connection", (socket) => {
      this.serverStats.connected = true;
      console.log("connection made")
      this.socketList.push(socket);
      socket.emit("ping", { addr: "manager"})
      socket.on("pong", (arg) => {
        console.log(arg)
        this.callback("pong", arg)
      })
    })

  }
}