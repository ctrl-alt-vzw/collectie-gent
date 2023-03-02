



import React, { useEffect } from 'react';

function Clipping(props) {


  return (
      <div className="clipping">
        <img src={`https://media.collage.gent/uploads/200/${props.data.imageURI}`} />
      </div>
  );
}

export default Clipping;
