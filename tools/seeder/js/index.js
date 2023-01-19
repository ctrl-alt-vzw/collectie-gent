import coloriseApp from './color.js'

const URL = 'https://api.collage.gent';

function generateBody(limit, skip) {
  const variables={
    "limit": limit,
    "skip": skip,
    "searchValue": {
      "value": "",
      "isAsc": false,
      "relation_filter": [],
      "randomize": true,
      "key": "title",
      "has_mediafile": true,
      "skip_relations": false,
      "and_filter": false
    }
  }
  const query=`
  query getEntities($limit: Int, $skip: Int, $searchValue: SearchFilter!) {
    Entities(limit: $limit, skip: $skip, searchValue: $searchValue) {
      count
      limit
      results {
        ...minimalEntity
        __typename
      }
      relations {
        ...fullRelation
        __typename
      }
      __typename
    }
  }

  fragment minimalEntity on Entity {
    id
    object_id
    type
    title: metadata(key: [title]) {
      key
      value
      __typename
    }
    description: metadata(key: [description]) {
      key
      value
      __typename
    }
    primary_mediafile
    primary_transcode
    primary_mediafile_info {
      width
      height
      __typename
    }
    mediafiles {
      mediatype {
        type
        mime
        image
        audio
        video
        pdf
        __typename
      }
      __typename
    }
    __typename
  }

  fragment fullRelation on Relation {
    key
    type
    label
    value
    order
    __typename
  }

  `

  return  {
    query,
    variables
  }
}

let currentFetch = 0;

function initFetching(start = 0) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'origin': "*"
    },
    body: JSON.stringify(generateBody(50, start))
  };

  fetch('https://sleepy-fortress-82290.herokuapp.com/https://data.collectie.gent/api/graphql?=', options)
    .then(response => response.json())
    .then(response => {
      const container = document.getElementById("container")
      if(response.data.Entities) {
        response.data.Entities.results.forEach(async (item) => {
          if(item.primary_transcode) {

            const concr = {
              label: item.title[0] ? item.title[0].value : "",
              id: item.object_id.split(":")[1],
              origin: item.object_id.split(":")[0],
              imageURI: item.primary_transcode
            }
            await sendToDB(concr)
          }
        })
        currentFetch += response.data.Entities.results.length;
        // if(currentFetch < 61070) {
          console.log(currentFetch)
        //}
      } else {
        console.log(response)
      }
      initFetching(currentFetch)  
    })
    .catch(err => {
      console.error(err)
        initFetching(currentFetch)  
    });
}
async function sendToDB(d) {
  fetch(URL + "/annotation", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(d)
  })
  .then(r => r.json())
  .then(async (result) => {
    if(!result.message) {
      // await coloriseApp.init(result[0], () => {
        console.log(result[0].id, result[0].UUID)
      //   document.getElementById("container").innerHTML = ""
      // });
    }
  })
  .catch((e) => {
    console.log("err", e)
  }) 
}


initFetching()

