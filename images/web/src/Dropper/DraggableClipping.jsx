import React, { useEffect, useState } from 'react'
import Clipping from './Clipping'
import interact from 'interactjs'


function DraggableClipping(props) {
  const [position, setPosition] = useState({x: 0, y:0})
  const [imageIsLoaded, imageLoaded] = useState(false)
  const [canBeDropped, setCanBeDropped] = useState(true )
  

  const dragPosition = {x: props.clipping_data.x, y: props.clipping_data.y}

  useEffect(() => {
    document.getElementById("image"+props.clipping_data.id).style.left = props.clipping_data.x+"px"
    document.getElementById("image"+props.clipping_data.id).style.top = props.clipping_data.y+"px"
    // document.getElementById("image"+props.clipping_data.id).style.zIdex = props.clipping_data.zIndex

    // setPosition({x: props.clipping_data.x, y: props.clipping_data.y}) 
    

    if(props.moveable) {
      interact('#image'+props.clipping_data.id).draggable({
        listeners: {
          start (event) {
            console.log(event, event.target)
          },
          move (event) {
            dragPosition.x += event.dx
            dragPosition.y += event.dy
            // event.target.style.transform = `translate(${position.x}px, ${position.y}px)`

            event.target.style.top = dragPosition.y+"px";
            event.target.style.left = dragPosition.x+"px";
            
            // check if not too close
            const canBe = props.checkPositioning(event.rect.left, event.rect.top, props.clipping_data);
            setCanBeDropped(canBe == 0);
            setPosition(dragPosition)
            props.updatePosition(dragPosition)
            // console.log(event.target.style.top)
          },
        }
      })
    }
  }, [])
  return (
    <div className="draggable" id={"image"+props.clipping_data.id}
      onClick={() => console.log(props.clipping_data.id)}
        style={{
          opacity: canBeDropped ? 1 : 0.2
        }}>
      <Clipping 
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


