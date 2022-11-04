
import http from 'http';
import express from "express";
import knex from "knex";
import cors from 'cors';
import createTables from "./db/helpers.js";

import annotation from './routes/annotation.js';
import clipping from './routes/clipping.js';
import error from './routes/error.js';
import vertex from './routes/vertex.js';

import MQTTClient from './mqttClient.js';

const connection = {
    host : process.env.POSTGRES_HOST ? process.env.POSTGRES_HOST : "localhost",
    port : 5432,
    user : process.env.POSTGRES_USER ? process.env.POSTGRES_USER : "postgres",
    password : process.env.POSTGRES_PASSWORD ? process.env.POSTGRES_PASSWORD : "test",
    database : process.env.POSTGRES_DATABASE ? process.env.POSTGRES_DATABASE : "test"
  };
const pg = knex({
  client: 'pg',
  connection: connection
});

const mqttClient = new MQTTClient("api", mqttMessageHandler, ["*"]);

// console.log(connection)

async function initialise() {
  await createTables(pg);
  mqttClient.connect();
  
}



// API endpoints
const port = 3000;

const app = express();
http.Server(app); 
app.use(cors())
app.use(express.json())

app.get("/", async (req, res) => {
  res.send({
    "endpoints": {
      "annotation": {
        "GET /annotation": "display all records",
        "GET /annotation/empty": "Display all records with empty annotation",
        "PATCH /annotation/[UUID]": "update an annotation, body: {annotation: [new annotation]}",
        "DELETE /annotation/[UUID]": "Delete a record",
        "POST /annotation": "Add a record, needs { imageURI, id, origin }",
        "GET /annotation/uniqueItemCount": "Count of all unique records in the DB, limitted to 100",
        "GET /annotation/byQuery/:query": "List all records with a specific annotation"
      }, 
      "clippings": {
        "GET /clipping": "display all records",
        "DELETE /clipping/[UUID]": "Delete a record",
        "POST /clipping": "Add a record, needs { originID, collection, x, y, imageURI }"
      }, 
      "errors": {
        "GET /errors": "display all records",
        "DELETE /error/[UUID]": "Delete a record",
        "POST /error": "Add a record, needs { originID, collection, x, y, imageURI }"
      },
      "vertex": {
        "GET /vertex": "display all records",
        "DELETE /vertex/[UUID]": "Delete a record",
        "POST /vertex": "Add a record, needs { x, y, z, annotationUUID }",
        "GET /vertex/:uuid": "display a specific record",
        "GET /vertex/annotation/:uuid": "display a specific record by annotation",
      }
    },
    "version": "0.2"
  })
})

annotation(app, pg);
clipping(app, pg, mqttClient);
error(app, pg);
vertex(app, pg);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})


function mqttMessageHandler(topic, message) {
  console.log(topic, message)
}

initialise();