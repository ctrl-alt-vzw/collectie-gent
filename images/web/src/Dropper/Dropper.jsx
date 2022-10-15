import React, { useEffect } from 'react'
import Loader from './../Common/Loader.jsx'
import DraggableClipping from './DraggableClipping'
import { ManagerContext } from "../Manager/index.js"
import { calculateOffset } from './../Common/helpers.js'


function Dropper(props) {

  const [ state, dispatch ] = React.useContext(ManagerContext)
  const [data, setData] = React.useState([]);
  const [position, setPosition] = React.useState({})
  const [allowed, setAllowed] = React.useState(true);
  const [yOffset, setYOffset] = React.useState([]);
  // const [scale, setScale] = React.useState(window.innerWidth / state.options.canvasWidth)
  const scale = 1


  console.log(state)
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ADDR}/clipping`)
      .then(r => r.json())
      .then((data) => {
        console.log("fetched clippings")
        const yOff = calculateOffset(data);
        setYOffset(yOff)

        setData(data.map((e) => {
          if(e.UUID === state.clipping.UUID) {
            return {
              ...e,
              y: window.innerHeight /2 + 200 + yOff,
              x: window.innerWidth / 2
            }
          }
          return e
        }))
      })
  }, [])


  const updatePosition = (p) => {
    setPosition({...p, y: p.y + ( yOffset * scale) })
  }

  const handlePositioned = (position) => {

    fetch(`${process.env.REACT_APP_API_ADDR}/clipping/${state.clipping.UUID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        x: position.x,
        y: position.y
      })
    })
      .then(r => r.json())
      .then((data) => {
        console.log(data)    
        dispatch({ type: "clipping_positioned", payload: {...state.clipping, ...position} })
      })
    
  }
  
  return (
    <div id="container">
      {data.length === 0 ? <Loader message="loading clippings" /> : null}
      { data.map((clipping, key) => {
        clipping["zIndex"] = data.length - key;
        return <DraggableClipping 
          clipping_data={clipping}  
          offSet={yOffset}
          key={key} 
          save_location={handlePositioned} 
          moveable={clipping.UUID === state.clipping.UUID} 
          updatePosition={updatePosition}
          scale={scale}
        />
      })}


     <div id="header">
      <button className={"active"} onClick={() => handlePositioned(position)}>Save position</button>
     </div>
    </div>
  )
}

export default Dropper;