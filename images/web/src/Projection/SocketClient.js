
import { io } from 'socket.io-client'


export default class SocketClient {
  constructor() {
    const socket = io("ws://localhost:3003");

    socket.on("ping", (arg) => {
      console.log(arg)
      socket.emit("pong", "yas")
    })
  }
}