


function calculateOffset(data) {

  const set = data
  .sort((a, b) => {
    return b.y - a.y
  })
  .slice(0, 50);
  const total = set.reduce((a, b) =>  {
      return a + b.y
    }, 0);
  // console.log(total / set.length)
  return ((total / set.length) * .8)


}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

module.exports = {
  calculateOffset,
  getCookie,
  setCookie
}