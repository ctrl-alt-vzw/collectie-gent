import React, { useEffect } from 'react'
import Loader from './../Common/Loader.jsx'
import { ManagerContext } from "../Manager/index.js"
import {calculateOffset} from './../Common/helpers.js'
import Item from "./Item.jsx"


function Picker(props) {

  const [state , dispatch ] = React.useContext(ManagerContext)
  const [data, setData] = React.useState([]);
  const [scale, setScale] = React.useState(window.innerWidth / state.options.canvasWidth)
  // const scale = 1

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ADDR ? process.env.REACT_APP_API_ADDR : "https://api.collage.gent"}/annotation/random`)
      .then(r => r.json())
      .then((data) => {
        setData(data)
      })
  }, [])

  const handleReturn = () => {
    dispatch({ type: "reset_and_view", payload: {} })
  }
  const handleCutSelection = (e) => {
    dispatch({ type: "pick_annotation", payload: e })
  }
  const handleNeighbourSelection = (e) => {
    console.log(e)
    fetch(`${process.env.REACT_APP_API_ADDR ? process.env.REACT_APP_API_ADDR : "https://api.collage.gent"}/vertex/neighboursByUUID?UUID=${e.UUID}`)
      .then(r => r.json())
      .then((data) => {
        setData(data)
      })

  }
  return (

    <div id="container">
      {data.length === 0 ? <Loader message="loading options" /> : null}
      { data.map((ann, key) => {
        
        return <
          Item
          data={ann}
          key={key} 
          handleCutSelection={handleCutSelection}
          handleNeighbourSelection={handleNeighbourSelection}
        />
      })}
      <div id="header">
        <button onClick={handleReturn}>Terug naar de collage</button>
      </div>
    </div>
  )
}

export default Picker;