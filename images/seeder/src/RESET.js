"use strict"

let currentAnnotation = 0;
export async function emptyAnnotation(uuid) {
  const t = JSON.stringify({ annotation: "" });
  await fetch("https://api.datacratie.cc/annotation/" + uuid, {
    method: "PATCH",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: t
  })
    .then(r => r.json())
    .then((data) => {
      console.log(data)
      currentAnnotation++;
      if(currentAnnotation < current.length){
        emptyAnnotation(current[currentAnnotation])
      }
    })
}


const current = // add annotations;
emptyAnnotation(current[currentAnnotation])
