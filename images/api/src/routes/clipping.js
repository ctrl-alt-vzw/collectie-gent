import { generateUUID } from './../helpers.js'


// t.increments('id').primary();
// t.string('imageURI', 1000);
// t.string('UUID', 1000);
// t.string('originID', 1000);
// t.string('collection', 1000);
// t.string('placedAt', 1000);
// t.integer("x");
// t.integer("y");
// t.timestamps(true, true);

export default function clipping(app, pg) {
  app.delete("/clipping/:uuid", async (req, res) => {
    pg.delete().table("clippings").where({UUID: req.params.uuid}).returning("id").then((d) => {
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
  // update the thing?
  
  app.put("/clipping/:uuid", async(req, res) => {
    const b = req.body;
    const uuid = req.params.uuid;

    await pg.update({x: b.x, y: b.y}).table("clippings").where({UUID: uuid}).returning("*").then((d) => {
      res.send(d);
    }).catch((e) => {
        console.log(e)
        res.status(401).send()
    })    
  })

  app.post("/clipping", async(req, res) => {
    console.log("saving")
    const b = req.body;

    console.log(b.originID, b.collection, b.x, b.y, b.imageURI, b.normalURI);
    if(b.originID && b.collection && b.imageURI && b.width && b.height && b.normalURI) {
      const toInsert = {
        imageURI: b.imageURI,
        UUID: generateUUID(),
        originID: b.originID,
        collection: b.collection,
        placedAt: "",
        x: b.x,
        y: b.y,
        width: b.width,
        height: b.height,
        normalURI: b.normalURI
      }
      await pg.insert(toInsert).table("clippings").returning("*").then((d) => {
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


  app.get("/clipping", async (req, res) => {
    await pg.select("*").table("clippings").orderBy("id", "ASC").then((data) => {
      res.send(data)
    })
    .catch((e) => {
      res.status(500).send(e)
    })
  })


  app.get("/clipping/bottom", async (req, res) => {
    await pg.select("*").table("clippings").orderBy("y", "DESC").limit(50).then((data) => {
      res.send(data)
    })
    .catch((e) => {
      res.status(500).send(e)
    })
  })

}