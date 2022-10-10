
import http from 'http';
import express from "express";
import knex from "knex";
import cors from 'cors';
import createTables from "./db/helpers.js";

import annotation from './routes/annotation.js';
import clipping from './routes/clipping.js';
import error from './routes/error.js';


const pg = knex({
  client: 'pg',
  connection: {
    host : process.env.POSTGRES_HOST ? process.env.POSTGRES_HOST : "localhost",
    port : 5432,
    user : process.env.POSTGRES_USER ? process.env.POSTGRES_USER : "postgres",
    password : process.env.POSTGRES_PASSWORD ? process.env.POSTGRES_PASSWORD : "test",
    database : process.env.POSTGRES_DATABASE ? process.env.POSTGRES_DATABASE : "test"
  }
});

async function initialise() {
  console.log("connect")
  await createTables(pg);
  
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
        "POST /annotation": "Add a record, needs { imageURI, id, origin }"
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
      }
    },
    "version": "0.1"
  })
})

annotation(app, pg);
clipping(app, pg);
error(app, pg);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

initialise();