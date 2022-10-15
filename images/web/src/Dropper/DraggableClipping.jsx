import React, { useEffect, useState } from 'react'
import Clipping from './Clipping'
import interact from 'interactjs'


function DraggableClipping(props) {
  const [position, setPosition] = useState({x: window.innerWidth / 2, y: window.innerHeight - 200})
  const [imageIsLoaded, imageLoaded] = useState(false)
  const [canBeDropped, setCanBeDropped] = useState(true )
  const [scale, ] = React.useState(props.scale);



  useEffect(() => {
    const x = (props.clipping_data.x) * scale;
    const y = (props.clipping_data.y - (props.offSet)) * scale;

    const dragPosition = {x, y}

    document.getElementById("image"+props.clipping_data.id).style.left = x +"px"
    document.getElementById("image"+props.clipping_data.id).style.top = y +"px"

    if(props.moveable) {
      interact('#image'+props.clipping_data.id).draggable({
        listeners: {
          start (event) {
            console.log(event, event.target)
          },
          move (event) {
            dragPosition.x = event.client.x
            dragPosition.y = event.client.y

            event.target.style.top = dragPosition.y+"px";
            event.target.style.left = dragPosition.x+"px";
            
            setPosition(dragPosition)
            props.updatePosition({x: event.client.x, y: event.client.y})
            // console.log(event.target.style.top)
          },
          end (event) {
            console.log(event, event.target)
          },
        }
      })
    }
  }, [])
  return (
    <div className="draggable" id={"image"+props.clipping_data.id}
      onClick={() => console.log(props.clipping_data.id)}>
      <Clipping 
        scale={scale}
        clipping_data={props.clipping_data} 
        key={props.clipping_data.id + "clipping"} 
        image_is_loaded={imageIsLoaded} 
        image_loaded={imageLoaded} 
   /> 
    </div>
  )  
}
export default DraggableClipping;

// <Clipping clipping_data={props.clipping_data} position={position} />


