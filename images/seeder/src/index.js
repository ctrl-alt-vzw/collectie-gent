
import http from 'http';
import express from "express";
import cors from 'cors';
import {startEventStream, seedFetch} from "./LDES.js"

// import { sendToDB, appendToFile} from './helpers.js'



// API endpoints
const port = 3000;
const app = express();
http.Server(app); 
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("hello world")
})

app.get("/seed", (req, res) => {
  startEventStream()
  res.send("hello world")
})

app.get("/f", (req, res) => {
  seedFetch()
  res.send("hello world")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
