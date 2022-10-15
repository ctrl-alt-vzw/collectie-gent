

import React, { useEffect } from 'react';
import { ManagerContext } from "../Manager/index.js"

function Clipping(props) {
  const [ state,  ] = React.useContext(ManagerContext)
  const [scale, ] = React.useState(props.scale);

  useEffect(() => {

    const x = (props.clipping_data.x) * scale;
    const y = (props.clipping_data.y - (props.offSet)) * scale;

    document.getElementById("image_fixed"+props.clipping_data.id).style.left = x +"px"
    document.getElementById("image_fixed"+props.clipping_data.id).style.top = y +"px"

  }, []);
  if(props.clipping_data.height > props.clipping_data.width) {
    const ratio = props.clipping_data.width / props.clipping_data.height

    return (
      <div className="clippingItem" id={"image_fixed"+props.clipping_data.id}>
        <img 
          src={props.clipping_data.imageURI.replace("/800/", "/200/")}
          style={{
            width: `${200  * ratio * props.scale}px`,
            height: `${200 * props.scale}px`,
            marginTop: `${ - 100 * ratio * props.scale}px`,
            marginLeft: `${- 100  * props.scale}px`
          }}
          alt={"clipped piece from a user in a collage"}
        />
      </div>
    )
  } else {
    const ratio = props.clipping_data.height / props.clipping_data.width

    return (
      <div className="clippingItem" id={"image_fixed"+props.clipping_data.id}>
        <img 
          src={props.clipping_data.imageURI.replace("/800/", "/200/")}
          style={{
            width: `${200 * props.scale}px`,
            height: `${200 * ratio * props.scale}px`,
            marginTop: `${ -100  * props.scale}px`,
            marginLeft: `${ -100  * ratio * props.scale}px`
          }}
          alt={"clipped piece from a user in a collage"}
        />
      </div>
    )
  }
  

}
export default Clipping;

