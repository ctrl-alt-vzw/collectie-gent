import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';

function Clipping(props) {
  const [scale, ] = useState(props.scale);
  // const scale = 1;
  const navigate = useNavigate();


  const [metr, setMetr] = useState({})
  

  // console.log(props.clipping_data)
  useEffect(() => {
    let height = props.clipping_data.height;
    let width = props.clipping_data.width;
    let x = props.clipping_data.x * scale + props.xOffset;
    let y = props.clipping_data.y * scale;

    if(height > width) {
      const r = width / height;
      width = 200 * r * scale;
      height = 200  * scale;
    } else {
      const r = height / width;
      width = 200 * scale;
      height = 200 * r * scale;
    }

    // if(width < height) {
    //   const r = height / width;
    //   width = 200 * scale;
    //   height = 200 * r * scale;
    // } else {
    //   const r = width / height;
    //   height = 200 * scale;
    //   width = 200 * r  * scale;
    // }

    x = x - (width/2);
    y = y - (height/2);
    setMetr({
      x, y, width, height
    })
  }, [])
  return (
    <div className="clippingItem" id={"image_fixed"+props.clipping_data.id} style={{
      top: `${metr.y}px`,
      left: `${metr.x}px`
    }} onClick={() => { navigate("/"+props.clipping_data.id)}}>
      <img 
        src={`https://media.collage.gent/uploads/200/${props.clipping_data.imageURI}`}
        style={{
          width: `${metr.width}px`,
          height: `${metr.height}px`
        }}
        alt={"A clipping from a user, done on "+new Date(props.clipping_data.created_at).toLocaleDateString('nl-NL')}
      />
    </div>
  )
  

}
export default Clipping;

