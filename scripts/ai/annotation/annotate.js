const fs = require('fs');

const API_URL = 'https://api.datacratie.cc';
const ANNOTATION_SERVICE_URL = 'http://192.168.86.83:5003/predictions';
const CONFIG = {
    model: 'conceptual-captions',
    use_beam_search: true
}

/* Error handling in log file */
const errors = [];
const addError = (errorCode, id, msg, note) => {
    let n = note ? note : '';
    errors.push({
        errorCode, id, msg, note: n
    });
}

const writeErrorFile = () => {
    fs.writeFileSync(`./logs/error_logs_${Date.now()}.json`, JSON.stringify(errors));
}

const getTasks = async () => {
    const response = await fetch(`${API_URL}/annotation/empty`);
    const json = await response.json();
    if(!json.length) {
        console.error("No new tasks");
        addError(0, 0, "No new tasks");
    }
    return json;
}

const run = async () => {
    const tasks = await getTasks();
    console.log(`We have ${tasks.length} annotation ahead, let's go`);
    try {
        for(const task of tasks) {
            //first test if image is available
            if(await imageExists(task.gentImageURI, task.UUID)) {
                try {
                    //get annotation
                    console.log('Starting annotation fetch for task #', task.id);
                    const annotation = await getAnnotation(task.gentImageURI, CONFIG.model, CONFIG.use_beam_search);
                    //push to API
                    
                    fetch(`${API_URL}/annotation/${task.UUID}`, {
                        method: 'PATCH',
                        mode: 'cors', // no-cors, *cors, same-origin
                        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                        headers: {
                          'Content-Type': 'application/json'
                          // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: JSON.stringify({annotation: annotation})
                    })
                    
                } catch (e) {
                    addError(0, task.UUID, "Failed adding annotation", e);
                }
            } else {
                addError(0, task.UUID, "Could not get image", e);
            }
    
        }
        writeErrorFile();
    } catch (e) {
        console.error("Error while trying to annotate", e);
        writeErrorFile();
    }
}

const imageExists = async (url, id) => {
    //Needs part of URI now
    const response = await fetch(`https://api.collectie.gent/iiif/image/iiif/3/${url}/info.json`);
    if(response.ok) {
        return true
    } else {
        console.error(`IMG ERROR: No IMG exists for ${id} / ${url}`)
        addError(response.status, id, "Image does not exist", url);
        return false
    }
}

const getAnnotation = async (imgUrl, model, beam) => {
    const url = `https://api.collectie.gent/iiif/imageiiif/3/${imgUrl}/full/^1000,/0/default.jpg`;
    console.log(imgUrl, url);
    try {
        const response = await fetch(ANNOTATION_SERVICE_URL, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({input: {
                image: url,
                model: model,
                use_beam_search: beam
              }}) // body data type must match "Content-Type" header
        })
        const json = await response.json();
        console.log(json);
        if(!response.ok) {
            addError(response.status, '', 'HTTP Error fetching annotation', imgUrl);
        }
        if(json.status == 'success' && json.output.length) {
            console.log(json.output[0].text);
            return json.output[0].text;
        } else {
            console.log("Some error fetching annotation")
            throw Error(json.status);
        }
    } catch (e) {
        console.log("Some error fetching annotation during request");
        console.log(e);
        throw Error(e);
    }
}

run();


/* getAnnotation(
    "https://api.collectie.gent/iiif/image/iiif/2/935704e60ce7fea2228d5047672187a4-transcode-2011-0075_0-2.jpg/full/full/0/default.jpg",
    'coco',
    true
); */