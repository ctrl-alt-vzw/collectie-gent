
function dist(a, c) {
  return Math.abs(Math.sqrt(Math.pow(a.x-c.x, 2)+Math.pow(a.y-c.y, 2)));
}
function dist3D(a, c) {
  return Math.abs(Math.sqrt(Math.pow(a.bx-c.bx, 2)+Math.pow(a.by-c.by, 2)+Math.pow(a.bz-c.bz, 2)));
}
function mousePosition(e) {
    var posX = e.clientX;
    var posY = e.clientY;
    return { x: posX, y: posY}
}

function touchPosition(e) {
  if(e.touches.length > 0) {
    const touch = e.touches[0]
    var posX = touch.clientX;
    var posY = touch.clientY;
    // console.log(posX, posY)
    return { x: posX, y: posY}
  }
}

function millis() {
  return new Date().getTime();
}

function mapValues(number, in_min, in_max, out_min, out_max) {
  return (number - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

module.exports =  {
  dist,
  dist3D,
  mousePosition,
  touchPosition,
  millis,
  mapValues
}