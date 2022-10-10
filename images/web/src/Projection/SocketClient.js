
import { io } from 'socket.io-client'


export default class SocketClient {
  constructor() {
    const socket = io("ws://localhost:3004");

    socket.on("ping", (arg) => {
      console.log(arg)
      socket.emit("pong", "yas")
    })
  }
}