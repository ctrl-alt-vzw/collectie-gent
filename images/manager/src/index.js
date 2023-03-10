

import express from 'express'
import cors from 'cors';

import MQTTClient from './mqttClient.js';
import SocketManager from './socketManager.js'

const controllers = [];
const services = [];


const client = new MQTTClient("manager", messageHandler, ["services/api/+"]);
const ws = new SocketManager("socketManager", socketMessageHandler)



client.connect();
ws.connect()

function messageHandler(topic, message) {
  const b = JSON.parse(message.toString());
  const info = topic.split("/");
  const cat = info[0];
  const source = info[1];
  const top = info[2];

  if(source == "api"&& top == "clipping") {
    console.log("sending")
    ws.broadcast("clipping/added/"+ b.UUID)
  }
  if(source == "api"&& top == "worker") {
    console.log("sending worker output", b)
    ws.broadcast("worker/receipt/"+ b.workerID)
  }
}

function socketMessageHandler(topic, message) {
  console.log(topic, message)
  
}


const app = express()
const port = 3000;
app.use(cors())

app.get('/', (req, res) => {
  res.send(JSON.stringify({ hello: "world"}))
})

app.listen(port, () => {
  console.log(`Manager listening at port ${port}`)
})
