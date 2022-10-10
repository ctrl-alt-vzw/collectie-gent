import React, { useEffect } from 'react'
import Loader from './../Common/Loader.jsx'
import DraggableClipping from './DraggableClipping'
import { ManagerContext } from "../Manager/index.js"



function Dropper(props) {

  const [ state, dispatch ] = React.useContext(ManagerContext)
  const [data, setData] = React.useState([]);
  const [position, setPosition] = React.useState({})
  const [allowed, setAllowed] = React.useState(true);
  const [yOffset, setYOffset] = React.useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ADDR}/clipping`)
      .then(r => r.json())
      .then((data) => {
        console.log("fetched clippings")
        const total = data.reduce((a, b) => a + b.y, 0);
        const yOff = (total / data.length)
        setData(data.map((e) => {
          if(e.UUID !== state.clipping.UUID) {
            return {
              ...e,
              y: e.y - (yOff / 2)
            }
          }
          return e
        }))
        setYOffset(yOff)
      })
  }, [])

  const checkPositioning = (x, y, active) => {
    let tooClose = 0;
    data.forEach((other) => {
      if(other.UUID !== active.UUID) {
        const cx = x + (100 / 2);
        const cy = y + (100 / 2);
        const tx = other.x + (100 / 2);
        const ty = other.y + (100 / 2);
        

        const d = Math.hypot(tx - cx, ty - cy)
        const minimal = 65;
        if(d < minimal) {
          tooClose +=1;
        }
      }
    })
    setAllowed(tooClose == 0)
    return tooClose
  }

  const updatePosition = (p) => {
    setPosition(p)
  }

  const handlePositioned = (position) => {
    if(allowed) {
      // fetch("https://api.datacratie.cc/clipping/"+state.clipping.UUID, {
      fetch(`${process.env.REACT_APP_API_ADDR}/clipping/${state.clipping.UUID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          x: position.x,
          y: position.y + (yOffset / 2)
        })
      })
        .then(r => r.json())
        .then((data) => {
          console.log(data)    
          dispatch({ type: "clipping_positioned", payload: {...state.clipping, ...position} })
        })
    } else {
      console.log("cannot position here")
    }
  }
  
  return (
    <div id="container">
      {data.length === 0 ? <Loader message="loading clippings" /> : null}
      { data.map((clipping, key) => {
        clipping["zIndex"] = data.length - key;
        return <DraggableClipping 
          clipping_data={clipping}  
          key={key} 
          save_location={handlePositioned} 
          moveable={clipping.UUID === state.clipping.UUID} 
          checkPositioning={checkPositioning}  
          updatePosition={updatePosition}
        />
      })}


     <div id="header">
      <button className={allowed ? "active" : "inactive"} onClick={() => handlePositioned(position)}>Save position</button>
     </div>
    </div>
  )
}

export default Dropper;