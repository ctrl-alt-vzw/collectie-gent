import { generateUUID } from './../helpers.js'



export default function vertex2D(app, pg) {
  app.delete("/vertex2D/:uuid", async (req, res) => {
    pg.delete().table("vertex2D").where({UUID: req.params.uuid}).returning("id").then((d) => {
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


  app.post("/vertex2D", async(req, res) => {
    // console.log("saving")
    const b = req.body;

    if(b.annotationUUID && b.x && b.y) {
      const toInsert = {
        UUID: generateUUID(),
        x: b.x,
        y: b.y,
        annotationUUID: b.annotationUUID
      }
      await pg.select("*").table("vertex2D").where({annotationUUID: b.annotationUUID}).then(async (d) => { 
        if(d.length > 0) {
          await pg.update({x: toInsert.x, y: toInsert.y}).table("vertex2D").where({annotationUUID: b.annotationUUID}).returning("*").then((d) => {
            res.send({updated: d});
          }).catch((e) => {
              console.log(e)
              res.status(401).send()
          })
        }  else {
          await pg.insert(toInsert).table("vertex2D").returning("*").then((d) => {
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


  app.get("/vertex2D/annotation/:uuid", async (req, res) => {
    await pg.select("*").table("vertex2D").where({annotationUUID: req.params.uuid}).then((data) => {
      res.send(data)
    })
    .catch((e) => {
      res.status(500).send(e)
    })
  })

  app.get("/vertex2D/nearestWithImage", async(req, res) => {
    // console.log(req.query, "init")
    await pg.raw(`SELECT vertex2D."UUID", vertex2D.x, vertex2D.y, vertex2D."annotationUUID", annotations."gentImageURI", annotations.metadata, annotations.annotation, annotations.colordata, annotations.imagedata, annotations.collection, annotations."originID" FROM vertex2D INNER JOIN annotations ON vertex2D."annotationUUID" = annotations."UUID" ORDER BY ABS(x - ${req.query.x}) + ABS(y - ${req.query.y}) LIMIT ${req.query.amount} `) 
      .then((data) => {
        res.send(data);
      })
      .catch((e) => {
        res.status(500).send(e)
      })
  })
  app.get("/vertex2D/nearest", async(req, res) => {
    // console.log(req.query, "init")
    await pg.raw(`SELECT * FROM vertex2D ORDER BY ABS(x - ${req.query.x}) + ABS(y - ${req.query.y}) LIMIT ${req.query.amount} `) 
      .then((data) => {
        res.send(data);
      })
      .catch((e) => {
        res.status(500).send(e)
      })
  })
  app.get("/vertex2D/neighboursByUUID/:uuid", async(req, res) => {
    // console.log(req.query, "init")
    await pg.select("*").table("vertex2D").where({'annotationUUID': req.params.uuid}).then(async (items) => {
      if(items.length == 0) {
        res.status(404).send("none found")
      } else {
        console.log(items)
        await pg.raw(`SELECT vertex2D."UUID", vertex2D.x, vertex2D.y, vertex2D."annotationUUID", annotations."gentImageURI", annotations.metadata, annotations.annotation, annotations.colordata, annotations.imagedata, annotations.collection, annotations."originID" FROM vertex2D INNER JOIN annotations ON vertex2D."annotationUUID" = annotations."UUID" ORDER BY ABS(x - ${items[0].x}) + ABS(y - ${items[0].y}) LIMIT 20 `) 
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
  app.get("/vertex2D/:uuid", async (req, res) => {
    await pg.select("*").table("vertex2D").where({UUID: req.params.uuid}).then((data) => {
      res.send(data)
    })
    .catch((e) => {
      res.status(500).send(e)
    })
  })

  app.get("/vertex2DEnriched", async (req, res) => {
    await pg.raw(`SELECT vertex2D."UUID", vertex2D.x, vertex2D.y, vertex2D."annotationUUID", annotations."gentImageURI", annotations.annotation, annotations.colordata, annotations.imagedata, annotations.collection, annotations."originID" FROM vertex2D INNER JOIN annotations ON vertex2D."annotationUUID" = annotations."UUID"  ORDER BY vertex2D.id`) 
    .then((data) => {
      res.send(data)
    })
    .catch((e) => {
      res.status(500).send(e)
    })
  })
  app.get("/vertex2D", async (req, res) => {
    await pg.select("*").table("vertex2D").orderBy("id", "ASC").then((data) => {
      res.send(data)
    })
    .catch((e) => {
      res.status(500).send(e)
    })
  })
  app.get("/vertex2D/byQuery/:query", async(req, res) => {
    await pg.raw(`SELECT * FROM vertex2D WHERE ${req.params.query}`) 
      .then((data) => {
        res.send(data);
      })
      .catch((e) => {
        res.status(500).send(e)
      })
  })


}