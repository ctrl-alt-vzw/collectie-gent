import React from 'react'

function Item(props){
  return( 
    <div className="item">
      <div className="imageContainer">
        <img src={props.data.gentImageURI} alt={props.data.annotation} style={{
          backgroundColor: `rgba(${props.data.imagedata.colors.tl.join(',')})`,
          minHeight: '200px'
        }} />
      </div>
      <h1>{props.data.annotation}</h1>
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