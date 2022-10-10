
import http from 'http';
import express from "express";
import multer from "multer"
import path  from "path";
import fs  from "fs";
import sharp from 'sharp';
import cors from 'cors';


// fix __dirname
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(req.body)
    cb(null, path.join(__dirname, './../uploads'))
  },
  filename: function (req, file, cb) {
    // console.log(file)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    let ext = file.originalname.split('.').pop();
    if(ext == "blob") {
      ext = "png"
    }
    req.body.imageURI =  file.fieldname + '-' + uniqueSuffix + '.' + ext;
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext)
  }
})

const upload = multer({ storage: storage })



// API endpoints
const port = 3000;



const app = express();
http.Server(app); 
app.use(cors())

// put the HTML file containing your form in a directory named "public" (relative to where this script is located)

app.use(express.json())

app.get("/", (req, res) => {
  res.send("hello world")
})


// app.get("/", express.static(path.join(__dirname, './../uploads')));
app.get('/uploads/mask/:fileName', function (req, res) {
  const filePath = path.join(__dirname, './../uploads/mask', req.params.fileName)
  res.sendFile(filePath);
});

// app.get("/", express.static(path.join(__dirname, './../uploads')));
app.get('/uploads/200/:fileName', function (req, res) {
  const filePath = path.join(__dirname, './../uploads/200', req.params.fileName)
  res.sendFile(filePath);
});
// app.get("/", express.static(path.join(__dirname, './../uploads')));
app.get('/uploads/400/:fileName', function (req, res) {
  const filePath = path.join(__dirname, './../uploads/400', req.params.fileName)
  res.sendFile(filePath);
});
// app.get("/", express.static(path.join(__dirname, './../uploads')));
app.get('/uploads/800/:fileName', function (req, res) {
  const filePath = path.join(__dirname, './../uploads/800', req.params.fileName)
  res.sendFile(filePath);
});

// app.get("/", express.static(path.join(__dirname, './../uploads')));
app.get('/uploads/normal/:fileName', function (req, res) {
  const filePath = path.join(__dirname, './../uploads/normal', req.params.fileName)
  res.sendFile(filePath);
});

// app.get("/", express.static(path.join(__dirname, './../uploads')));
app.get('/uploads/:fileName', function (req, res) {
  const filePath = path.join(__dirname, './../uploads', req.params.fileName)
  res.sendFile(filePath);
});


const cpUpload = upload.fields([{ name: 'clipping', maxCount: 1 }, { name: 'normal', maxCount: 1 }])
app.post('/upload', cpUpload, async (req, res) => {
  console.log(
    req.files['clipping'][0],
    req.files['normal'][0]
  )
  const { filename: image } = req.files['clipping'][0];
  const { filename: normal } = req.files['normal'][0];

  await sharp(req.files['clipping'][0].path)
  .resize(400)
  .png()
  .toFile(
      path.resolve(req.files['clipping'][0].destination, '200', image)
  )

  await sharp(req.files['clipping'][0].path)
  .resize(200)
  .png()
  .toFile(
      path.resolve(req.files['clipping'][0].destination, '400', image)
  )

  await sharp(req.files['clipping'][0].path)
  .resize(800)
  .png()
  .toFile(
      path.resolve(req.files['clipping'][0].destination, '800', image)
  )

  await sharp(req.files['normal'][0].path)
  .resize(400)
  .png()
  .toFile(
      path.resolve(req.files['normal'][0].destination, 'normal', normal)
  )

  // if want to save original, delete this
  fs.unlinkSync(req.files['clipping'][0].path)
  fs.unlinkSync(req.files['normal'][0].path)

  const hostname = req.protocol + '://' + req.get('host');

  res.send({
    200: `${hostname}/uploads/200/${req.files['clipping'][0].filename}`,
    400: `${hostname}/uploads/400/${req.files['clipping'][0].filename}`,
    800: `${hostname}/uploads/800/${req.files['clipping'][0].filename}`,
    normal: `${hostname}/uploads/normal/${req.files['normal'][0].filename}`
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
