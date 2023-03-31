import { generateUUID } from './../helpers.js'



export default function error(app, pg) {
  app.delete("/log/:uuid", async (req, res) => {
    pg.delete().table("logs").where({UUID: req.params.uuid}).returning("id").then((d) => {
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

  app.patch("/log/validate/:uuid", async (req, res) => {
    pg.update({ validated: 1}).table("logs").where({UUID: req.params.uuid}).returning("id").then((d) => {
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
  

  app.post("/log", async(req, res) => {
    // console.log("saving")
    const b = req.body;

    if(b.uri) {
      const toInsert = {
        UUID: generateUUID(),
        service: b.service,
        message: b.message,
        validated: 0
      }
      await pg.insert(toInsert).table("logs").returning("*").then((d) => {
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


  app.get("/logs", async (req, res) => {
    await pg.select("*").table("logs").orderBy("id", "ASC").then((data) => {
      res.send(data)
    })
    .catch((e) => {
      res.status(500).send(e)
    })
  })

  app.get("/logs/unvalidated", async (req, res) => {
    await pg.select("*").table("logs").orderBy("id", "DESC").where({validated: 0}).then((data) => {
      res.send(data)
    })
    .catch((e) => {
      res.status(500).send(e)
    })
  })

}