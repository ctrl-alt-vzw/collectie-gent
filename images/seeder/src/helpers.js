"use strict"


import path  from "path";
import fs  from "fs";

const URL = 'http://api.datacratie.cc';

// fix __dirname
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export async function appendToFile(d, file) {

  fs.appendFile(path.join(__dirname, './../logs', file), JSON.stringify(d), function (err) {
    if (err) throw err;
    console.log('Saved in ' + file);
  });
}


export async function sendToDB(d, cb) {
  console.log("storing")
  fetch(URL + "/annotation", {
    method: "POST",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(d)
  })
  .then(r => r.json())
  .then(result => {
    console.log("done")
    cb()
  })
  .catch((e) => {
    console.log("err", e)
    cb()
  }) 
}
