import { generateUUID } from './../helpers.js'



export default function vertex(app, pg) {
  app.delete("/vertex/:uuid", async (req, res) => {
    pg.delete().table("vertex").where({UUID: req.params.uuid}).returning("id").then((d) => {
      if(d.length > 0) {
        res.send({
          message: "deleted",
          id: d[0]
        })
      } else {
        res.send({
          message: "not found"
        })
      }
    })
  })


  app.post("/vertex", async(req, res) => {
    // console.log("saving")
    const b = req.body;

    if(b.annotationUUID && b.x && b.y && b.z) {
      const toInsert = {
        UUID: generateUUID(),
        x: b.x,
        y: b.y,
        z: b.z,
        annotationUUID: b.annotationUUID
      }
      await pg.select("*").table("vertex").where({annotationUUID: b.annotationUUID}).then(async (d) => { 
        if(d.length > 0) {
          await pg.update({x: toInsert.x, y: toInsert.y, z:toInsert.z}).table("vertex").where({annotationUUID: b.annotationUUID}).returning("*").then((d) => {
            res.send({updated: d});
          }).catch((e) => {
              console.log(e)
              res.status(401).send()
          })
        }  else {
          await pg.insert(toInsert).table("vertex").returning("*").then((d) => {
            res.send({ inserted: d});
          }).catch((e) => {
              console.log(e)
              res.status(401).send()
          })

        }
      }).catch((e) => {
          console.log(e)
          res.status(401).send()
      })
    }
    else {
      res.status(400).send()
    }
  })


  app.get("/vertex/annotation/:uuid", async (req, res) => {
    await pg.select("*").table("vertex").where({annotationUUID: req.params.uuid}).then((data) => {
      res.send(data)
    })
    .catch((e) => {
      res.status(500).send(e)
    })
  })
//SELECT vertex."UUID", vertex.x, vertex.y, vertex.z, vertex."annotationUUID", annotations."gentImageURI" FROM vertex INNER JOIN annotations ON vertex."annotationUUID" = annotations."UUID" ORDER BY

  app.get("/vertex/nearestWithImage", async(req, res) => {
    // console.log(req.query, "init")
    await pg.raw(`SELECT vertex."UUID", vertex.x, vertex.y, vertex.z, vertex."annotationUUID", annotations."gentImageURI", annotations.metadata, annotations.annotation, annotations.colordata, annotations.imagedata, annotations.collection, annotations."originID" FROM vertex INNER JOIN annotations ON vertex."annotationUUID" = annotations."UUID" ORDER BY ABS(x - ${req.query.x}) + ABS(y - ${req.query.y}) + ABS(z - ${req.query.z}) LIMIT ${req.query.amount} `) 
      .then((data) => {
        res.send(data);
      })
      .catch((e) => {
        res.status(500).send(e)
      })
  })
  app.get("/vertex/nearest", async(req, res) => {
    // console.log(req.query, "init")
    await pg.raw(`SELECT * FROM vertex ORDER BY ABS(x - ${req.query.x}) + ABS(y - ${req.query.y}) + ABS(z - ${req.query.z}) LIMIT ${req.query.amount} `) 
      .then((data) => {
        res.send(data);
      })
      .catch((e) => {
        res.status(500).send(e)
      })
  })
  app.get("/vertex/neighboursByUUID/:uuid", async(req, res) => {
    // console.log(req.query, "init")
    await pg.select("*").table("vertex").where({'annotationUUID': req.params.uuid}).then(async (items) => {
      if(items.length == 0) {
        res.status(404).send("none found")
      } else {
        console.log(items)
        await pg.raw(`SELECT vertex."UUID", vertex.x, vertex.y, vertex.z, vertex."annotationUUID", annotations."gentImageURI", annotations.metadata, annotations.annotation, annotations.colordata, annotations.imagedata, annotations.collection, annotations."originID" FROM vertex INNER JOIN annotations ON vertex."annotationUUID" = annotations."UUID" ORDER BY ABS(x - ${items[0].x}) + ABS(y - ${items[0].y}) + ABS(z - ${items[0].z}) LIMIT 20 `) 
          .then((data) => {
            console.log(data)
            res.send(data);
          })
          .catch((e) => {
            res.status(500).send(e)
          })

      }
    })
    .catch((e) => {
            console.log("here")
            console.log(e)
      res.status(500).send(e)
    })
  })
  app.get("/vertex/:uuid", async (req, res) => {
    await pg.select("*").table("vertex").where({UUID: req.params.uuid}).then((data) => {
      res.send(data)
    })
    .catch((e) => {
      res.status(500).send(e)
    })
  })

  app.get("/vertexEnriched", async (req, res) => {
    await pg.raw(`SELECT vertex."UUID", vertex.x, vertex.y, vertex.z, vertex."annotationUUID", annotations."gentImageURI", annotations.annotation, annotations.colordata, annotations.imagedata, annotations.collection, annotations."originID" FROM vertex INNER JOIN annotations ON vertex."annotationUUID" = annotations."UUID"  ORDER BY vertex.id`) 
    .then((data) => {
      res.send(data)
    })
    .catch((e) => {
      res.status(500).send(e)
    })
  })
  app.get("/vertex", async (req, res) => {
    await pg.select("*").table("vertex").orderBy("id", "ASC").then((data) => {
      res.send(data)
    })
    .catch((e) => {
      res.status(500).send(e)
    })
  })
  app.get("/vertex/byQuery/:query", async(req, res) => {
    await pg.raw(`SELECT * FROM vertex WHERE ${req.params.query}`) 
      .then((data) => {
        res.send(data);
      })
      .catch((e) => {
        res.status(500).send(e)
      })
  })


}