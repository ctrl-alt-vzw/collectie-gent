

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
            width: `${200 * ratio * props.scale}px`,
            height: `${200  * props.scale}px`,
            marginTop: `${ - 100 * ratio * props.scale}px`,
            marginLeft: `${- 100  * props.scale}px`
        }}
        alt={"clipped piece from a user in a collage"}
      />
    )
  } else {
    const ratio = props.clipping_data.height / props.clipping_data.width
    return (
      <img 
        src={props.clipping_data.imageURI.replace("/800/", "/200/" )}
        style={{
            width: `${200  * props.scale}px`,
            height: `${200  * ratio * props.scale}px`,
            marginTop: `${ -100  * props.scale}px`,
            marginLeft: `${ -100  * ratio * props.scale}px`
        }}
        alt={"clipped piece from a user in a collage"}
      />
    )

  }
  

}
export default Clipping;

