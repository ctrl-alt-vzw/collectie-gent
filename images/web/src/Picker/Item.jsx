import React from 'react'

function Item(props){
  console.log(props.data)
  const image = `https://api.collectie.gent/iiif/imageiiif/3/${props.data.gentImageURI}/full/^1000,/0/default.jpg`
  return( 
    <div className="item">
      <div className="imageContainer">
        <img src={image} alt={props.data.annotation} style={{
          backgroundColor: `rgba(${ props.data.imagedata && props.data.imagedata.colors ? props.data.imagedata.colors.tl.join(',') : "0,0,0,1"})`,
          minHeight: '200px'
        }} />
      </div>
      <h1>{props.data.annotation !== null ? props.data.annotation : props.data.originalAnnotation}</h1>
      <div>
        <p>Collection: {props.data.collection}</p>
        <p>origin: {props.data.originID}</p>
      </div>
      <div className="actions">
        <button id="select" onClick={(e) => props.handleElementSelection(props.data)}>Select</button>
      </div>
    </div>
  )
}

export default Item;