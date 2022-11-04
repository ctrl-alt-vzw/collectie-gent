
export default async function createTables(pg) {
  // pg.schema.dropTable('logs').then((d) => {
  //   console.log("deleted table")
  // })
  pg.schema.hasTable('clippings').then(function(exists) {
    if (!exists) {
      return pg.schema.createTable('clippings', function(t) {
        t.increments('id').primary();
        t.string('imageURI', 1000);
        t.string('normal', 1000);
        t.string('UUID', 1000);
        t.string('originID', 1000);
        t.string('collection', 1000);
        t.string('placedAt', 1000);
        t.integer("x");
        t.integer("y");
        t.integer("width");
        t.integer("height");
        t.timestamps(true, true);
      })

    } else {
      console.log("tables clippings exist")

    }
  })
  pg.schema.hasTable('annotations').then(function(exists) {
    if (!exists) {
      return pg.schema.createTable('annotations', function(t) {
        t.increments('id').primary();
        t.string('UUID', 1000);
        t.string('gentImageURI', 500);
        t.string('originID', 100);
        t.string('collection', 20);
        t.json('imagedata');
        t.text('annotation', "longtext");
        t.text('originalAnnotation', "longtext");
        t.boolean("flagged").defaultTo(false);
        t.boolean("hidden").defaultTo(false);
        t.timestamps(true, true);
      })

    } else {
      console.log("tables annotations exist")

    }
  })


  pg.schema.hasTable('errors').then(function(exists) {
    if (!exists) {
      return pg.schema.createTable('errors', function(t) {
        t.increments('id').primary();
        t.string('UUID', 1000);
        t.string('uri', 1000);
        t.integer("validated").defaultTo(0);
        t.timestamps(true, true);
      })

    } else {
      console.log("tables errors exist")

    }
  })

};
