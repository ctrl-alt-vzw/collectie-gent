
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom"

import Menu from './Common/Menu.jsx'


function Detail(props) {
  const { id } = useParams();
  const [item, setItem] =  useState([])
  const [origin, setOrigin] =  useState([])

  const [ratio, setRatio] = useState(1);

  useEffect(() => {
    fetch(`https://api.collage.gent/clipping/byId/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setItem(data);
        console.log(data)
        fetch(`https://api.collage.gent/annotation/byCollectionOrigin/${data.collection}/${data.originID}`)
          .then((r) => r.json())
          .then((data) => {
            console.log(data);
            setOrigin(data[0]);

            setRatio( data[0].imagedata.width / (window.innerWidth))

            console.log(data[0].imagedata.width / (window.innerWidth))

          })
      })
  }, [])

  return (
      <div className="App">
        <Menu />
        <div id="detail">
          { item && item.clippingData && origin && origin.imagedata ? 
            <div id="imageContainer" style={{ height:  origin.imagedata.height / ratio + 100 + "px"}}>
               <>
                <img id="originImage" src={`https://api.collectie.gent/iiif/imageiiif/3/${origin.gentImageURI}/full/^1000,/0/default.jpg`} style={{
                  width: Math.round(origin.imagedata.width / ratio) + "px",
                  height: origin.imagedata.height / ratio + "px",
                  top: "50px",
                  opacity: 0.4
                }} />
                <img id="clippedImage" src={`https://media.collage.gent/uploads/200/${item.imageURI}`} style={{
                top:  50 + item.clippingData.y / ratio  + "px",
                left: (25 / ratio) + item.clippingData.x / ratio + "px",
                width: item.clippingData.w / ratio + "px",
                height: item.clippingData.h / ratio + "px"
              }} />
              </>

            </div> 

          : null }
          <div className="informationContainer">
            <div className="headline">{id}</div>
            <div className="annotations">
              <div className="aiannotation">{origin.annotation}</div>
              <div className="originAnnotation">{origin.originalAnnotation}</div>
            </div>

            <div className="placementInfo">
              <div className="placementX">{item.x}</div>
              <div className="placementY">{item.y}</div>
              <div className="placementLoc">{item.placedAt}</div>
              <div className="placementDate">{item.created_at}</div>
            </div>
          </div> 
        </div>
      </div>
  );
}

export default Detail;
