import React, { useEffect, useState } from 'react'
import Loader from './../Common/Loader.jsx'
import Clipping from './Clipping'
import ClippingCard from './ClippingCard'
import {calculateOffset, getCookie, setCookie} from './../Common/helpers.js'



function Viewer(props) {
  let margin = 0;
  if(window.innerWidth > 600) { margin = 100; }

  const [data, setData] = useState([]);
  const [useCards, setUseCards] = useState(getCookie("useCards"));
  const [yOffset, setYOffset] = useState([]);
  const [scale, setScale] = useState((window.innerWidth - margin*2) / 1300)
  const [xOffset, ] = useState(margin)

  useEffect(() => {
    // console.log(`${process.env.REACT_APP_API_ADDR ? process.env.REACT_APP_API_ADDR : "https://api.collage.gent"}/clipping`)
    fetch(`https://api.collage.gent/clipping`)
      .then(r => r.json())
      .then((data) => {
        setYOffset(calculateOffset(data) + 300) 
        const sorted = data.sort((a,b) => b.id - a.id)
        setData(sorted)
      })
  }, [])

  const handleReturn = () => {
  }
    return (
      <>
        <div id="containerList">
          {data.length === 0 ? <Loader message="loading clippings" /> : null}
          { useCards ? 

            data.map((clipping, key) => {
              return <ClippingCard
                clipping_data={clipping} 
                key={key} 
              />
            })

          : data.map((clipping, key) => {
              clipping["zIndex"] = data.length - key;
              return <Clipping 
                clipping_data={clipping} 
                offSet={yOffset} 
                xOffset={xOffset}
                key={key} 
                scale={scale}  
              />
            })
          }
        </div>
        <div id="overlay">
          <a className="cta" onClick={() => { setUseCards(true); setCookie("useCards", true) }}>List</a>
          <a className="cta" onClick={() => { setUseCards(false); setCookie("useCards", false)  }}>Collage</a>
        </div>
      </>
    )

}

export default Viewer;