import { useNavigate, Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';

function Clipping(props) {
  const [scale, ] = useState(props.scale);
  // const scale = 1;
  const navigate = useNavigate();
        var options = { year: 'numeric', month: 'long', day: 'numeric' };

  return (
    <div className="clippingCard" id={"image_fixed"+props.clipping_data.id} onClick={() => { navigate("/"+props.clipping_data.id)}}>
      <div className="imgContainer">
        <img 
          src={`https://media.collage.gent/uploads/200/${props.clipping_data.imageURI}`}
          alt={"clipped piece from a user in a collage"}
        />
      </div>  
      <div className="info">
        <p>{props.clipping_data.originID}</p>
        <p>{props.clipping_data.collection}</p>
        <p>{new Date(props.clipping_data.created_at).toLocaleDateString("nl-BE", options)}</p>
        <Link className="ctaLight" to={"/"+props.clipping_data.id}>Meer info</Link>
      </div>
    </div>
  )
  

}
export default Clipping;

