import websockets.*;
import com.cage.zxing4p3.*;
ZXING4P zxing4p;
PImage  QRCode;

static boolean PRINTING = true;

PImage img;
String createdAtSTR = "0000-00-00T00:00:00.001Z";
JSONArray jobs = new JSONArray();
int number;
PFont titleF;
PFont smallF;
PFont largeF;
PFont titleFLong;

String workerID = "88339633-2d99-4e9f-92a0-d674e5a0a936";

int multipl = 5;
int WIDTH = 102 * multipl;
int HEIGHT = 152 * multipl;

JSONObject data;

//String test = "88339633-2d99-4e9f-92a0-d674e5a0a936";
String test = "TEST";
WebsocketClient wsc;

void setup()
{
  size(510, 760);
  titleF = createFont("data/r.otf", 32);
  titleFLong = createFont("data/r.otf", 26);
  largeF = createFont("data/r.otf", 100);
  smallF = createFont("r.ttf", 13);
  textFont(titleF);
  noStroke();
  zxing4p = new ZXING4P();
  zxing4p.version();
  wsc = new WebsocketClient(this, "ws://206.189.5.89:3004");
  wsc.sendMessage("ping");
  
  frameRate(1);
  
}
void draw()
{
  drawSticker();
  if(frameCount % 20 == 0) {
    wsc.sendMessage("ping");
  }
}

void drawSticker() {
  background(255);
  try {
    generateQR("https://www.instagram.com/ctrlalt_vzw/");
    QRCode.resize(100, 100);
    image(QRCode,  width -110, 10);
  } 
  catch(IllegalArgumentException e) {
    println("qr code issue");
  }
  
  pushMatrix();
  translate(width / 2, 40);
  fill(0);
  textFont(titleF);
  textAlign(CENTER, CENTER);
  text("Thank you for your cooperation", -50, 0);
  stroke(0);
  textFont(smallF);
  line(-width/2 + 20, 30, width / 2 - 120, 30);
  translate(0, 50);
  textAlign(LEFT, CENTER);
  text("Worker ID:", -width / 2 + 20, 0);
  textAlign(RIGHT, CENTER);
  text(createdAtSTR, +width / 2 - 120, 0);
  rect(-width / 2 + 20, 20, width - 40, 40);
  textFont(titleF);
  textAlign(CENTER, CENTER);
  fill(255);
  text(workerID, 0, 40);
  translate(0, 100);
  fill(0);
  textFont(smallF);
  textAlign(LEFT, CENTER);
  text("Your shift:", -width / 2 + 20, -10);
  line(-width/2 + 20, 0, width / 2 - 20, 0);
  // insert the shift list
  translate(0, 110);
  line(-width/2 + 20, 0, width / 2 - 20, 0);
  text("your last approval", -width / 2+20, 20);
  //drawImage();
  popMatrix();
  if(jobs.size() > 0) {
    pushMatrix();
  translate(20, 200);
  fill(0);
  noStroke();
  textFont(smallF);
  textAlign(RIGHT, CENTER);
  text("approved?", width - 40, -20);
  textAlign(LEFT, CENTER);
  for (int i = 0; i < 5; i++) {
    fill(0);
    noStroke();
      JSONObject j = jobs.getJSONObject(i);
      String imageOrigin = j.getString("originID");
      boolean approved = j.getBoolean("approved");
      createdAtSTR = j.getString("created_at");
      String collection = j.getString("collection");
      text(i, 0, 0);
      text(imageOrigin, 20, 0);
      text(collection, width / 2, 0);
      if(approved) {
        fill(0);
        noStroke();
        rect(width - 50, 0, 10, 10);
      } else {
        fill(255);
        stroke(0);
        rect(width - 50, 0, 10, 10);
      }
      delay(10);
      translate(0, 20);
      
    }
    popMatrix();
  }
  pushMatrix();
  translate(0, 300);
  if (img != null) {
    println(img);
    drawImage(img);
  }  
  popMatrix();
  save("image_to_print.png");
}

void drawImage(PImage img) {
    img.loadPixels();
    int PIXELSIZE = 4;
    noStroke();
    fill(0);
    color(0);
    // Loop through every pixel column
    if(img.width > img.height) {
      img.resize(510 - 120, 0);
    } else {
      img.resize(0, 510 - 120);
    }
    
    // bereik
    float min = 255;
    float max = 0;
    for (int x = 0; x < img.width; x+=PIXELSIZE ) {
      for (int y = 0; y < img.height; y+=PIXELSIZE ) {
        int loc = x + y*img.width;
        // Use the formula to find the 1D location
        color c = img.pixels[loc];
        if(alpha(c) > 10) {
          if(brightness(c) > max) max = brightness(c);
          if(brightness(c) < min) min = brightness(c);
        }
      }
    }
    for (int x = 0; x < img.width; x+=PIXELSIZE ) {
      for (int y = 0; y < img.height; y+=PIXELSIZE ) {
        int loc = x + y*img.width;
        // Use the formula to find the 1D location
        color c = img.pixels[loc];
        if(alpha(c) > 10) {
          
          int size = round(map(brightness(c), min, max, PIXELSIZE + 1, 1));
          int offsetX = 510 / 2 - img.width / 2;
          int offsetY = 510 / 2 - img.height / 2 - 20;
          rect(x + offsetX , y + offsetY, size, size);
          
        }
      }
    }
}
void keyPressed()
{
  if (key=='p' || key=='P') {
    printer();
  }
}

//This is an event like onMouseClicked. If you chose to use it, it will be executed whenever the server sends a message 
void webSocketEvent(String msg){  
   println(msg);
   String[] lst = split(msg, "/");
   getData(lst[2]);
   
}

void getDataFromAnnotation(String ID) {
  try {
    String[] URLPARTS = { "https://api.collage.gent/annotation/byId/", ID };
    String URL = join(URLPARTS, "");
    JSONObject d = loadJSONObject( URL );
    String imageURI = d.getString("gentImageURI");
    String[] IMGURLPARTS = { "https://media.collage.gent/pictograms/", imageURI };
    String IMGURL = join(IMGURLPARTS, "");
    img = loadImage(IMGURL);
   
  }
    
  catch(NullPointerException e) {
    println("no connection");
  }
}
void getData(String UUID) {
  try {
    String[] URLPARTS = { "https://api.collage.gent/worker/", UUID };
    String URL = join(URLPARTS, "");
    JSONArray d = loadJSONArray( URL );
    println(d.size());
    if(d.size() % 5 == 0) {
      jobs = d;
      getDataFromAnnotation(d.getJSONObject(0).getString("annotationUUID"));
      
      
     if(PRINTING) {
       delay(1000);
       printer();
     }
    }
    drawSticker();
  }
    
  catch(NullPointerException e) {
    println("no connection");
  }
}
void generateQR(String path) {
  QRCode = zxing4p.generateQRCode(path, 150, 150);
  QRCode.save(dataPath("")+"/qrcode_tmp.gif");
  QRCode = loadImage("qrcode_tmp.gif");
}
void printer() { 
    printImage("/Users/janeveraert/Documents/Processing/printerTestDesignWorker/image_to_print.png");
}

void printImage(String path) {
  Process p = exec("lp",  "-o",  "media=Custom.102x152mm", path);
  try {
    int result = p.waitFor();
    println("the process returned " + result);
  }
  catch (InterruptedException e) {
    println("error : " + e);
  }
}