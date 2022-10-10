"use strict"

// "iiif/presentation/v2/manifest/""
import { newEngine } from '@treecg/actor-init-ldes-client';

import fs from "fs"

let count = 0;


export function seedFetch() {
  fetch("https://apidg.gent.be/opendata/adlib2eventstream/v1/dmg/objecten")
    .then(r=> r.json())
    .then((data) => {
      data["@included"].forEach((element) => {
        element["Entiteit.isHetOnderwerpVan"].forEach((subject) => {
         const uri = subject["@id"];
          const spl = uri.split("/");
          const tid = spl[7].split(":");
          const collection = tid[0];
          const id = tid[1];

          fetch(uri)
            .then(r => r.json())
            .then((item) => {
              try {
                
                const toSend = {
                  label: item["label"]["@value"],
                  id: id,
                  origin: collection,
                  imageURI: item["sequences"][0]["canvases"][0]["images"][0]["resource"]["@id"]
                }
                console.log(toSend)

              } 
              catch(e){
                console.error("could not access")
              }
            })
        });


      })
    })
}


export function startEventStream(){
  try {
      let url = "https://apidg.gent.be/opendata/adlib2eventstream/v1/dmg/objecten";
      let options = {
          "pollingInterval": 5000, // millis
          "representation": "Object", //Object or Quads
          "fromTime": new Date("2021-02-03T15:46:12.307Z"),
          "emitMemberOnce": true,
          "disableSynchronization": true,
          "disableFraming": true,
          "jsonLdContext": { //Only necessary for Object representation
              "@context": [
                  "https://apidg.gent.be/opendata/adlib2eventstream/v1/context/cultureel-erfgoed-object-ap.jsonld",
                  "https://apidg.gent.be/opendata/adlib2eventstream/v1/context/persoon-basis.jsonld",
                  "https://apidg.gent.be/opendata/adlib2eventstream/v1/context/cultureel-erfgoed-event-ap.jsonld",
                  {
                       "dcterms:isVersionOf": {
                           "@type": "@id"
                      },
                      "prov": "http://www.w3.org/ns/prov#"
                  }
              ]
          }
      };
      let LDESClient = new newEngine();
      let eventstreamSync = LDESClient.createReadStream(url, options);
      // OR if you have a previous state
      // let eventstreamSync = LDESClient.createReadStream(url, options, state);
      eventstreamSync.on('data', async (member) => {
        // console.log(member)

          if (options.representation) {
              if (options.representation === "Object") {
                count++;
                  const memberURI = member.id;
                  const object = member.object;
                  try {
                  const url = object[0]["http://www.cidoc-crm.org/cidoc-crm/P129i_is_subject_of"][0]["@id"];
                  await fetch(url)
                    .then(r => r.json())
                    .then(async (data) => {
                      try { 
                        const d = {};
                        if(data["label"] && data["label"]["@value"]) {
                          // console.log("label: ", data["label"]["@value"])
                          d.label = data["label"]["@value"];
                        }
                        if(data["sequences"]) {
                          // console.log("imageURI: ", data["sequences"][0]["canvases"][0]["images"][0]["resource"]["@id"])
                          d.imageURI = data["sequences"][0]["canvases"][0]["images"][0]["resource"]["@id"];
                        }
                        let id = object[0]['@id'];
                        const spl = id.split("/");
                        d.origin = spl[5];
                        d.id = spl[6];
                        // console.log("id: ", d.id)
                        d.count = count;

                        if(d.label && d.imageURI && d.id) {
                            console.log("saving", url)
                            saveInDB(d)
                        }
                      } catch(e) {
                        console.group();
                        console.log("something wrong")
                        console.log(e);
                        console.log(url)
                        console.groupEnd()
                        // console.error(e)
                      }
                    })
                    .catch(e => {
                      saveError({ uri: url})
                      console.log("not available: ", url)
                    }) 
                  }
                  catch(e) {

                  }
              } 
          }
          // Want to pause event stream?
          // eventstreamSync.pause(); 
      });
      eventstreamSync.on('metadata', (metadata) => {
          // if (metadata.treeMetadata) console.log(metadata.treeMetadata); // follows the structure of the TREE metadata extractor (https://github.com/TREEcg/tree-metadata-extraction#extracted-metadata)
          console.log("meta", metadata.url); // page from where metadata has been extracted
      });
      eventstreamSync.on('pause', () => {
          // Export current state, but only when paused!
          let state = eventstreamSync.exportState();
          console.log("paused")
      });
      eventstreamSync.on('end', () => {
          console.log("No more data!");
      });
  } catch (e) {
      // console.error(e);
  }
}
async function saveInDB(d) {
  // console.log("init")
  fetch("https://api.datacratie.cc/annotation", {
    method: "POST",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(d)
  })
  .then(r => r.json())
  .then(result => {
    // console.log("done")
  })
  .catch((e) => {
    console.log("err", e)
  })
}


async function saveError(d) {
  // console.log("init")
  fetch("https://api.datacratie.cc/error", {
    method: "POST",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(d)
  })
  .then(r => r.json())
  .then(result => {
    // console.log(result)
  })
  .catch((e) => {
    console.log("err", e)
  })
}