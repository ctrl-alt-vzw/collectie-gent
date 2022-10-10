import React from 'react'

import { ManagerContext } from "../Manager/index.js"
import CanvasClass from "./CanvasClass.jsx"


function Cutter(props) {

  const [ state, dispatch ] = React.useContext(ManagerContext)
  const handleClippingCreated = (clipping) => {
    console.log("clipping", clipping)
    dispatch({ type: "cut_finished", payload: clipping })
  }
  return ( 
    <CanvasClass imageuri={state.annotation.gentImageURI} clippingcreated={handleClippingCreated} />
  )

}

export default Cutter;