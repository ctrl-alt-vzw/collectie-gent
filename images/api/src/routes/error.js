import { generateUUID } from './../helpers.js'



export default function error(app, pg) {
  app.delete("/error/:uuid", async (req, res) => {
    pg.delete().table("errors").where({UUID: req.params.uuid}).returning("id").then((d) => {
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

  app.patch("/error/validate/:uuid", async (req, res) => {
    pg.update({ validated: 1}).table("errors").where({UUID: req.params.uuid}).returning("id").then((d) => {
      if(d.length > 0) {
        res.send({
          message: "updated",
          id: d[0]
        })
      } else {
        res.send({
          message: "not found ",
          uuid: req.params.uuid
        })
      }
    })
  })
  

  app.post("/error", async(req, res) => {
    console.log("saving")
    const b = req.body;

    if(b.uri) {
      const toInsert = {
        UUID: generateUUID(),
        uri: b.uri,
        validated: 0
      }
      await pg.insert(toInsert).table("errors").returning("*").then((d) => {
        res.send(d);
      }).catch((e) => {
          console.log(e)
          res.status(401).send()
      })
    }
    else {
      res.status(400).send()
    }
  })


  app.get("/errors", async (req, res) => {
    await pg.select("*").table("errors").orderBy("id", "ASC").then((data) => {
      res.send(data)
    })
    .catch((e) => {
      res.status(500).send(e)
    })
  })

  app.get("/errors/unvalidated", async (req, res) => {
    await pg.select("*").table("errors").orderBy("id", "DESC").where({validated: 0}).then((data) => {
      res.send(data)
    })
    .catch((e) => {
      res.status(500).send(e)
    })
  })

}