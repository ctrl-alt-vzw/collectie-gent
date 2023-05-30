
import http from 'http';
import express from "express";
import knex from "knex";
import cors from 'cors';
import createTables from "./db/helpers.js";

import annotation from './routes/annotation.js';
import clipping from './routes/clipping.js';
import error from './routes/error.js';
import vertex from './routes/vertex.js';
import vertex2D from './routes/vertex2D.js';
import approval from './routes/approval.js';
import logs from './routes/logs.js';

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
      }, 
      "clippings": {
        "GET /clipping": "display all records",
        "DELETE /clipping/[UUID]": "Delete a record",
        "POST /clipping": "Add a record, needs { originID, collection, x, y, imageURI }",
        "PUT /clipping/:uuid": "Update position of a record, needs { x, y }",
        "PUT /clipping/:uuid/silent": "Update position of a record, needs { x, y }, does not print"
      }, 
      "errors": {
        "GET /errors": "display all records",
        "DELETE /error/[UUID]": "Delete a record",
        "POST /error": "Add a record, needs { originID, collection, x, y, imageURI }"
      },
      "errors": {
        "GET /logs": "display all records",
        "DELETE /log/[UUID]": "Delete a record",
        "POST /log": "Add a record, needs { service, message }"
      },
      "vertex": {
        "GET /vertex": "display all records",
        "DELETE /vertex/[UUID]": "Delete a record",
        "POST /vertex": "Add a record, needs { x, y, z, annotationUUID }",
        "GET /vertex/:uuid": "display a specific record",
        "GET /vertex/annotation/:uuid": "display a specific record by annotation",
        "GET /vertex/nearest?x=0&y=0&z=0&amount=10": "get the nearest vertices, with a coordinate and an amount of records returned"
      },
      "vertex2D": {
        "GET /vertex2D": "display all records",
        "DELETE /vertex2D/[UUID]": "Delete a record",
        "POST /vertex2D": "Add a record, needs { x, y, annotationUUID }",
        "GET /vertex2D/:uuid": "display a specific record",
        "GET /vertex2D/annotation/:uuid": "display a specific record by annotation",
        "GET /vertex2D/nearest?x=0&y=0&amount=10": "get the nearest vertices, with a coordinate and an amount of records returned"
      },
      "approval": {
        "GET /approvals": "display all records",
        "POST /approvals": "Add a record, needs { originID, annotationUUID, workerID, collection, approved (bool)}",
      }
    },
    "version": "1.0"
  })
})

annotation(app, pg);
clipping(app, pg, mqttClient);
error(app, pg);
vertex(app, pg);
vertex2D(app, pg);
logs(app, pg);
approval(app, pg, mqttClient);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})


function mqttMessageHandler(topic, message) {
  console.log(topic, message)
}

initialise();