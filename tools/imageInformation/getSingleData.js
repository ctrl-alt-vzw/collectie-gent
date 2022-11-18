const URL = 'https://api.datacratie.cc';

function generateBody(collection, id) {
  const variables={id: `${collection}:${id}`}
  const query=`
  query getEntityById($id: String!) {
  Entity(id: $id) {
    ...fullEntity
    __typename
  }
  }

fragment fullEntity on Entity {
  id
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
let annotations = [];
let lastID = 6015;

async function init(from = lastID) {
  fetch("https://api.datacratie.cc/annotation/startingfrom/"+from)
    .then(r => r.json())
    .then(data => {
      currentFetch = 0;
      annotations = data;
      fetchItem()
    })
}


function fetchItem() {
  const id = annotations[currentFetch].originID;
  const collection = annotations[currentFetch].collection;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'origin': "*"
    },
    body: JSON.stringify(generateBody(collection, id))
  };

  fetch('https://sleepy-fortress-82290.herokuapp.com/https://data.collectie.gent/api/graphql?=', options)
    .then(response => response.json())
    .then(async (response) => {
      console.log(response);

      const finalbody = {};

      const e = response.data.Entity;
      if(e){
        const meta = {};
        e.metadataCollection.forEach((o) => { 
          meta[o.data[0].label] = o.data[0].value 
        });
        finalbody["metadata"] = meta

        const rel = {};
        e.relations.forEach((o) => { 
          rel[o.label] = o.value 
        });
        finalbody["relations"] = rel;
        try {
          finalbody["description"] = e.description[0].value
          finalbody["title"] = e.title[0].value
        } catch(e) { console.log('not available')}
        console.log(finalbody)
      }
      await sendToDB(finalbody)
    })
    .catch(err => console.error(err));
}

init()


async function sendToDB(d) {
  fetch(URL + "/annotation/"+annotations[currentFetch].UUID + "/metadata", {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(d)
  })
  .then(r => r.json())
  .then(result => {
    lastID = result[0].id;
    console.log(result[0].id, result[0].UUID, result);
    currentFetch+=1;

    if(annotations.length <= currentFetch) {
      init(lastID);
    } else {
      fetchItem()
    }
  })
  .catch((e) => {
    console.log("err", e)
    currentFetch++;
    fetchItem()
  }) 
}

