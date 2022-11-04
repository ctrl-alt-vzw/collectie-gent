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

  app.get("/vertex/:uuid", async (req, res) => {
    await pg.select("*").table("vertex").where({UUID: req.params.uuid}).then((data) => {
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

}