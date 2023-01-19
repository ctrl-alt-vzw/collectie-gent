const fs = require('fs');
const data = require('./data/out_3D_perplex_30.json');

const API_URL = 'https://api.collage.gent';
const errors = [];
//1. load json file
//2. loop and push every vertex
//3. Clean up and write error file

const run = async () => {
    console.log('Starting...')
    const amount = data.length;
    console.log(`We have ${data.length} vertices to push`);
    let responses = [];
    try {
        for (item of data) {
            //push to API
            try {
                const resp = await fetch(`${API_URL}/vertex`, {
                    method: 'POST',
                    mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: JSON.stringify({
                        x: item.vectors[0],
                        y: item.vectors[1],
                        z: item.vectors[2],
                        annotationUUID: item.UUID
                    })
                })
                console.log(`Pushing ${index+1}/${amount}...`);

                console.log("Response", resp);
                responses.push(resp.status)
            } catch (e) {
                console.error(console.log(`Failed pushing ${index+1}/${amount}...`))
                addError(2, item.UUID, "Failed POST request", e);
            }

        }
    } catch (e) {
        addError(1, 0, "Failed loading data", e);
        writeErrorFile();
    }
    console.log(responses.length);
    responses.forEach(response => {
        if (response.status != 200) {
            addError(3, 0, "Failed request", response.code)
        }
    })
    writeErrorFile();
}

/* Error handling in log file */
const addError = (errorCode, id, msg, note) => {
    let n = note ? note : '';
    errors.push({
        errorCode,
        id,
        msg,
        note: n
    });
}

const writeErrorFile = () => {
    fs.writeFileSync(`./logs/error_logs_${Date.now()}.json`, JSON.stringify(errors));
}

run();