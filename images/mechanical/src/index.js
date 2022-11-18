

const express = require('express');
const cors = require('cors');
const path = require('path');


const app = express()
const port = 3000

app.use(cors())

app.use('/', express.static(path.join(__dirname, 'static')))
app.listen(port, () => {
  console.log(`Mechanical turk listening at port ${port}`)
})


