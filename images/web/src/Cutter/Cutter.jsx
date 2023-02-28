import React from 'react'

import { ManagerContext } from "../Manager/index.js"
import CanvasClass from "./CanvasClass.jsx"


function Cutter(props) {

  const [ state, dispatch ] = React.useContext(ManagerContext)
  const handleClippingCreated = (clipping) => {
    // console.log("clipping", clipping)
    dispatch({ type: "cut_finished", payload: clipping })
  }

  const image = `https://api.collectie.gent/iiif/imageiiif/3/${state.annotation.gentImageURI}/full/^1000,/0/default.jpg`
  return ( 
    <CanvasClass imageuri={image} originID={state.annotation.originID} collection={state.annotation.collection} clippingcreated={handleClippingCreated} />
  )

}

export default Cutter;