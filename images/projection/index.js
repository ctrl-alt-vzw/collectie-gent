  import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

  const socket = io("ws://localhost:3004")

  socket.on("ping", (arg)=> {
    console.log(arg)
    socket.emit("pong", {})
  });

