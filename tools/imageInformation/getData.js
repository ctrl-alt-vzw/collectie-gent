const URL = 'https://api.collage.gent';
let updated = 0;
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
        ...fullEntity
        __typename
      }
      __typename
    }
  }

fragment fullEntity on Entity {
  id
  object_id
  ldesResource
  type
  title: metadata(key: [title]) {
    key
    value
    __typename
  }
  scopeNote: metadata(key: [scopeNote]) {
    key
    value
    __typename
  }
  description: metadata(key: [description]) {
    key
    value
    __typename
  }
  publicationStatus: metadata(key: [publication_status]) {
    key
    value
    __typename
  }
  objectNumber: metadata(key: [object_number]) {
    key
    value
    __typename
  }
  metadataCollection(
    key: [title, description, object_number, scopeNote]
    label: []
  ) {
    ...MetadataCollectionFields
    __typename
  }
  primary_mediafile
  primary_transcode
  primary_transcode_location
  relations {
    key
    type
    label
    value
    __typename
  }
  __typename
  }

fragment MetadataCollectionFields on MetadataCollection {
  label
  nested
  data {
    value
    unMappedKey
    label
    nestedMetaData {
      ...NestedEntity
      metadataCollection(
        key: [title, description, object_number, scopeNote]
        label: [\"objectnummer\"]
      ) {
        label
        nested
        data {
          value
          unMappedKey
          label
          nestedMetaData {
            ...nestedEndEntity
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
  __typename
  }

fragment NestedEntity on Entity {
  id
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
  objectNumber: metadata(key: [object_number]) {
    key
    value
    __typename
  }
  relations {
    key
    type
    label
    value
    __typename
  }
  __typename
  }

fragment nestedEndEntity on Entity {
  id
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
  objectNumber: metadata(key: [object_number]) {
    key
    value
    __typename
  }
  metadataCollection(
    key: [title, description, object_number, scopeNote]
    label: [\"objectnummer\"]
  ) {
    label
    nested
    data {
      value
      unMappedKey
      label
      __typename
    }
    __typename
  }
  relations {
    key
    type
    label
    value
    __typename
  }
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
    body: JSON.stringify(generateBody(20, start))
  };

  fetch('https://sleepy-fortress-82290.herokuapp.com/https://data.collectie.gent/api/graphql?=', options)
    .then(response => response.json())
    .then(response => {
      console.log(response);
      response.data.Entities.results.forEach((result, index) => {
        formatAndSend(result)

        if(index==response.data.Entities.results.length - 1) {
          initFetching();
        }
      })
    })
    .catch(err => console.error(err));
}
initFetching()

function formatAndSend(item) {

  const finalbody = {};

  const e = item;
  if(e){
    const meta = {};
    e.metadataCollection.forEach((o) => { 
      meta[o.data[0].label] = o.data[0].value 
    });
    finalbody["metadata"] = meta
    const rel = {};
    if(e.relations) {
      e.relations.forEach((o) => { 
        rel[o.label] = o.value 
      });
      finalbody["relations"] = rel;
    }
    if(e.description.length > 0) finalbody["description"] = e.description[0].value;
    if(e.title.length > 0) finalbody["title"] = e.title[0].value;
      
    console.log(finalbody)
  }
  const collection =  e.object_id.split(":")[0];
  const id = e.object_id.split(":")[1];
  // console.log(finalbody, collection, id);
  sendToDB(finalbody, collection, id)
}



async function sendToDB(d, col, id) {
  fetch(URL + "/annotation/UUID/metadata", {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      metadata: d, 
      originID: id,
      collection: col,
    })
  })
  .then(r => r.json())
  .then(result => {
    if(result.length > 0) {
      console.log(result[0].UUID)
      updated+=1;
      document.getElementById("container").innerHTML = updated
    } else {
      console.log(result)
    }
  })
  .catch((e) => {
    console.log("err", e)
  }) 
}