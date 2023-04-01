import websockets.*;
import com.cage.zxing4p3.*;
import http.requests.*;

ZXING4P zxing4p;
PImage  QRCode;

static boolean PRINTING = true;

PImage img;
String uuidText = "NO IMAGE";
String collectionSTR = "NCF";
String collectionIDSTR = "000";
String createdAtSTR = "0000-00-00T00:00:00.001Z";
float placedX = 0.0;
float placedY = 0.0;
float placedW = 0.0;
float placedH = 0.0;


int number;
PFont titleF;
PFont smallF;
PFont largeF;
PFont titleFLong;

int multipl = 5;
int WIDTH = 102 * multipl;
int HEIGHT = 152 * multipl;

JSONObject data;


WebsocketClient wsc;

String testUUID = "015713bb-12c8-4efc-828d-855d10416f1f";

void setup()
{
  size(510, 760);
  //myPrinter = new Printer();
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
  getData(testUUID);
}
void logMessage(String message) {
  try {
    PostRequest post = new PostRequest("https://api.collage.gent/log");
    
    post.addHeader("Content-Type", "application/json");
    post.addData("{ \"service\": \"processing\",  \"message\":\"" + message + "\" }");
    post.send();
    System.out.println("Reponse Content: " + post.getContent());
    System.out.println("Reponse Content-Length Header: " + post.getHeader("Content-Length"));
  } catch(NullPointerException e) {
      println(e);
    }
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
    generateQR("https://collage.gent/" + number);
    QRCode.resize(190, 190);
    image(QRCode,  width -185, height - 210);
  } 
  catch(IllegalArgumentException e) {
    println("qr code issue");
    logMessage("qr code issue: "+e); 
  }
  
  pushMatrix();
  translate(0, 490);
  textAlign(CENTER, CENTER);
  textFont(titleF);
  fill(0);
  rect(10, 0, width - 20, 50);
  fill(255);
  text("COLLAGE GENT", width / 2, 22);
  fill(0);
  textFont(smallF);
  text(uuidText, width / 2, 60);
  stroke(0);
  line(10, 75, width-10, 75);
  popMatrix();
  
  
  pushMatrix();
  textAlign(LEFT, CENTER);
  translate(20, height-30);
  rotate(radians(270));
  textFont(titleF);
  if(collectionSTR.length() > 6) {
    textFont(titleFLong);    
  }
  text(collectionSTR, 20, 10);
  textFont(smallF);
  text(collectionIDSTR, 20, 40);
  stroke(0);
  line(20, 60, 150, 60);
  popMatrix();
  
  pushMatrix();
  translate(width / 2, height-30);
  textFont(largeF);
  fill(0);
  textAlign(LEFT, CENTER);
  rotate(radians(270));
  text(number, 20, -120);
  popMatrix();
  
  textFont(smallF);
  
  
  pushMatrix();
  translate(width / 2 - 50, height -185);
  for(int i = 0; i < 115; i++) {
    if(random(3) <1) {
      rect(i, 0, 1, 10);
    }
  }
  text("X: " + placedX, 0, 30);
  text("Y: " + placedY, 0, 45);
  text("W: " + placedW, 0, 60);
  text("H: " + placedH, 0, 75);
  text("date: " + createdAtSTR.split("T")[0], 0, 90);
  text("hour: " + createdAtSTR.split("T")[1], 0, 105);
  for(int i = 0; i < 115; i++) {
    if(random(3) <1) {
      rect(i, 125, 1, 10);
    }
  }
  popMatrix();
  
  
  line(10, height - 35, width - 10, height - 35);
  text("collage.gent/"+number, width / 2, height - 20);
  
  if (img != null) {
    drawImage(img);
  }  
  save("image_to_print.png");
}

void drawImage(PImage img) {
    img.loadPixels();
    int PIXELSIZE = 4;
    noStroke();
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
  if(key=='l') {
   
  }
}

void printer() { 
    printImage("/Users/janeveraert/Documents/Processing/printerTestDesign/image_to_print.png");
}

//This is an event like onMouseClicked. If you chose to use it, it will be executed whenever the server sends a message 
void webSocketEvent(String msg){  
   println(msg);
   if(!msg.equals("pong") && msg.indexOf("itemMove") == -1) {
     String[] lst = split(msg, "/");
     getData(lst[2]);
     if(PRINTING) {
       delay(1000);
       printer();
     }
   }
}


void getData(String UUID) {
  print("UUID:");
  println(UUID);
  if(UUID.equals("pong")) {
    println("just pong");
  } else {
    try {
      String[] URLPARTS = { "https://api.collage.gent/clipping/", UUID };
      String URL = join(URLPARTS, "");
      data = loadJSONObject( URL );
      
      String IMAGEURL = data.getString("imageURI");
      collectionSTR = data.getString("collection");
      collectionIDSTR = data.getString("originID");
      createdAtSTR = data.getString("created_at");
      
      placedX = data.getFloat("x");
      placedY = data.getFloat("y");
      placedW = data.getFloat("width");
      placedH = data.getFloat("height");
      
      uuidText = data.getString("UUID");
      number = data.getInt("id");
      
      String newURL = "https://media.collage.gent/uploads/200/"+IMAGEURL;
      img = loadImage(newURL);
      drawSticker();
    }
    catch(NullPointerException e) {
      println("no connection");
      logMessage("No connection: "+e); 

    }
  }
}
void generateQR(String path) {
  QRCode = zxing4p.generateQRCode(path, 200, 200);
  QRCode.save(dataPath("")+"/qrcode_tmp.gif");
  QRCode = loadImage("qrcode_tmp.gif");
}
void printImage(String path) {
  Process p = exec("lp",  "-o",  "media=Custom.102x152mm", path);
  try {
    int result = p.waitFor();
    println("the process returned " + result);
    logMessage("printer worked: "+result); 
  }
  catch (InterruptedException e) {
    logMessage("printer exception: "+e); 
    println("error : " + e);
  }
}