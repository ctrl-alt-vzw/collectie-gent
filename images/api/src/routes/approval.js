import { generateUUID } from './../helpers.js'



export default function approval(app, pg) {
  
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
    await pg.insert(toInsert).table("approvals").returning("*").then((d) => {
      res.send({ inserted: d});
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


}