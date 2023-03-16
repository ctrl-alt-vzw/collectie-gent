JSONArray json;

int currentIndex = 0;
int lastID = 0;
PImage img;

int numExc = 0;
static int SIZE = 400;
void setup() {
    size(900,900);
    loadData();
    surface.setResizable(true);
}
void draw() {
  background(0);
  try {
    if(json.size() > 0) {
      if(currentIndex == 20) {
        
        loadData();
      } else {
        JSONObject currentPiece = json.getJSONObject(currentIndex);
        lastID = currentPiece.getInt("id");
        String gentURL = currentPiece.getString("gentImageURI");
        gentURL = gentURL.replace(" ", "%20");
        String imageURL = "https://api.collectie.gent/iiif/imageiiif/3/"+gentURL + "/full/^1000,/0/default.jpg";
        
        img = loadImage(imageURL);
        if(img.width > img.height) {
          int w = SIZE;
          img.resize(w, 0);
        } else {
          int h = SIZE;
          img.resize(0, h);
        }
        image(img, (width / 2) - (img.width / 2),  (height / 2) - (img.height / 2));
        img.save("output/"+gentURL);
        
        color(255);
        text(lastID, 10, 20);
        text(currentPiece.getString("originID"), 10, 30);
        text(currentPiece.getString("collection"), 10, 40);
        text(currentPiece.getString("originalAnnotation"), 10, 50);
        text(currentPiece.getString("annotation"), 10, 60);
      }
      numExc = 0;
      currentIndex+=1;
    } 
    
  }
  catch(RuntimeException e) {
    currentIndex+=1;
    numExc +=1;
    
    if(numExc == 30) {
      exit();
    }
  }
}
void loadData() {
    
    json = loadJSONArray("https://api.collage.gent/annotation/startingFrom/"+lastID);
    println("loaded");
    currentIndex = 0;
}