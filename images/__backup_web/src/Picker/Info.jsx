import React, { useEffect} from 'react'

function Info(props) {
    console.log(props);
    return(
        <div id="infoContainer">
            <h1>Item</h1>
            <button>What do you do</button>
        </div>
    )
}

export default Info