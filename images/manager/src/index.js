

import express from 'express'
import cors from 'cors';

import MQTTClient from './mqttClient.js';
import SocketManager from './socketManager.js'

const controllers = [];
const services = [];


const client = new MQTTClient("manager", messageHandler, ["*"]);
const ws = new SocketManager("socketManager", socketMessageHandler)

const app = express()
const port = 3000
app.use(cors())

app.get('/', (req, res) => {
  res.send(JSON.stringify({ hello: "world"}))
})
app.listen(port, () => {
  console.log(`Manager listening at port ${port}`)
})

client.connect();
ws.connect()

function messageHandler(topic, message) {
  
}

function socketMessageHandler(topic, message) {
  
}
