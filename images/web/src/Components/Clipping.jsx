



import React, { useEffect } from 'react';
import { Link } from "react-router-dom";


function Clipping(props) {


  return (
      <div className="clipping">
        <img src={`https://media.collage.gent/uploads/200/${props.data.imageURI}`} />
        <Link to={"/" + props.data.id}>Detail</Link>
      </div>
  );
}

export default Clipping;
