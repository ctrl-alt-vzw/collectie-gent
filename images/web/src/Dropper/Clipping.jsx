

import React from 'react'
import { ManagerContext } from "../Manager/index.js"


function Clipping(props) {
  const [ state,  ] = React.useContext(ManagerContext)
  if(props.clipping_data.height > props.clipping_data.width) {
    const ratio = props.clipping_data.width / props.clipping_data.height
    return (
      <img 
        src={props.clipping_data.imageURI.replace("/800/", "/200/" )}
        style={{
            width: `${200 * state.options.scale.dropping * ratio}px`,
            height: `${200 * state.options.scale.dropping}px`
        }}
        alt={""}
      />
    )
  } else {
    const ratio = props.clipping_data.height / props.clipping_data.width
    return (
      <img 
        src={props.clipping_data.imageURI.replace("/800/", "/200/" )}
        style={{
            width: `${200 * state.options.scale.dropping}px`,
            height: `${200 * state.options.scale.dropping * ratio}px`
        }}
        alt={""}
      />
    )

  }
  

}
export default Clipping;

