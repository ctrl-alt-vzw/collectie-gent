import React, { useEffect } from 'react'
import Loader from './../Common/Loader.jsx'
import Clipping from './Clipping'
import { ManagerContext } from "../Manager/index.js"
import {calculateOffset} from './../Common/helpers.js'



function Viewer(props) {

  const [state , dispatch ] = React.useContext(ManagerContext)
  const [data, setData] = React.useState([]);
  const [yOffset, setYOffset] = React.useState([]);
  const [scale, setScale] = React.useState(window.innerWidth / state.options.canvasWidth)
  // const scale = 1

  useEffect(() => {
    console.log(`${process.env.REACT_APP_API_ADDR}/clipping`)
    fetch(`${process.env.REACT_APP_API_ADDR}/clipping`)
      .then(r => r.json())
      .then((data) => {
        setYOffset(calculateOffset(data)) 
        setData(data)
      })
  }, [])

  const handleReturn = () => {
    dispatch({ type: "reset_and_select", payload: {} })
  }
  
  return (

    <div id="container">
      {data.length === 0 ? <Loader message="loading clippings" /> : null}
      { data.map((clipping, key) => {
        clipping["zIndex"] = data.length - key;
        return <Clipping 
          clipping_data={clipping} 
          offSet={yOffset} 
          key={key} 
          scale={scale}  
        />
      })}
      <div id="header">
        <button onClick={handleReturn}>Select your own</button>
      </div>
    </div>
  )
}

export default Viewer;