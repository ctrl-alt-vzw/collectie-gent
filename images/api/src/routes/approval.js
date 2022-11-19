import { generateUUID } from './../helpers.js'



export default function approval(app, pg, mqttClient) {
  
  app.post("/approvals", async(req, res) => {
    // console.log("saving")
    const b = req.body;

    const toInsert = {
      UUID: generateUUID(),
      originID: b.originID,
      annotationUUID: b.annotationUUID,
      workerID: b.workerID,
      collection: b.collection,
      approved: b.approved
    }
    await pg.insert(toInsert).table("approvals").returning("*").then(async (d) => {
      res.send({ inserted: d});

      await pg.select("*").table("approvals").where({workerID: b.workerID}).then((works) => {
        mqttClient.broadcast("worker", JSON.stringify({ workerID: b.workerID }))
      })
    }).catch((e) => {
        console.log(e)
        res.status(401).send()
    })
  })

  app.get("/approvals", async (req, res) => {
    await pg.select("*").table("approvals").orderBy("id", "ASC").then((data) => {
      res.send(data)
    })
    .catch((e) => {
      res.status(500).send(e)
    })
  })

  app.get("/worker/:uuid", async (req, res) => {
    await pg.select("*").table("approvals").where({workerID: req.params.uuid}).orderBy("id", "DESC").then((data) => {
      res.send(data)
    })
    .catch((e) => {
      res.status(500).send(e)
    })
  })


}