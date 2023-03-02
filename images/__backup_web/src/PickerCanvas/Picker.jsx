import React from 'react'

import { ManagerContext } from "../Manager/index.js"
import CanvasClass from "./CanvasClass.jsx"


function Picker(props) {

  const [ state, dispatch ] = React.useContext(ManagerContext)
  
  const handleCutSelection = (e) => {
    console.log(e)
    dispatch({ type: "pick_annotation", payload: e })
  }
  
  const image = `https://api.collectie.gent/iiif/imageiiif/3/${state.annotation.gentImageURI}/full/^1000,/0/default.jpg`
  return ( 
    <CanvasClass cutSelected={handleCutSelection} />
  )

}

export default Picker;