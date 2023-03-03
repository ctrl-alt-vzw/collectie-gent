import React, { useEffect, useState } from 'react'
import Loader from './../Common/Loader.jsx'
import Clipping from './Clipping'
import {calculateOffset} from './../Common/helpers.js'



function Viewer(props) {
  let margin = 0;
  if(window.innerWidth > 600) { margin = 100; }

  const [data, setData] = useState([]);
  const [yOffset, setYOffset] = useState([]);
  const [scale, setScale] = useState((window.innerWidth - margin*2) / 2000)
  const [xOffset, ] = useState(margin)
  // const scale = 1

  useEffect(() => {
    // console.log(`${process.env.REACT_APP_API_ADDR ? process.env.REACT_APP_API_ADDR : "https://api.collage.gent"}/clipping`)
    fetch(`https://api.collage.gent/clipping`)
      .then(r => r.json())
      .then((data) => {
        setYOffset(calculateOffset(data)) 
        setData(data)
      })
  }, [])

  const handleReturn = () => {
  }
  
  return (

    <div id="container">
      {data.length === 0 ? <Loader message="loading clippings" /> : null}
      { data.map((clipping, key) => {
        clipping["zIndex"] = data.length - key;
        return <Clipping 
          clipping_data={clipping} 
          offSet={yOffset} 
          xOffset={xOffset}
          key={key} 
          scale={scale}  
        />
      })}
    </div>
  )
}

export default Viewer;