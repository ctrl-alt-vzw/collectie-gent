
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
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        data.created_at = new Date(data.created_at).toLocaleDateString("nl-BE", options);
        setItem(data);
        console.log(data)

        fetch(`https://api.collage.gent/annotation/byCollectionOrigin/${data.collection}/${data.originID}`)
          .then((r) => r.json())
          .then((data) => {
            console.log(data);
            setOrigin(data[0]);
            setRatio( (window.innerWidth) / data[0].imagedata.width)
            console.log(data[0].imagedata.width / (window.innerWidth))
          })
      })
  }, [])

  return (
      <div className="App">
        <Menu />
        <div id="detail">
          { item && item.clippingData && origin && origin.imagedata ? 
            <>
              <div id="imageContainer" style={{ height:  origin.imagedata.height * ratio + 50 + "px"}}>
                <>
                  <img id="originImage" src={`https://api.collectie.gent/iiif/imageiiif/3/${origin.gentImageURI}/full/^1000,/0/default.jpg`} style={{
                    width: (origin.imagedata.width) * ratio + "px",
                    height: (origin.imagedata.height) * ratio + "px",
                    top: "50px",
                    left:  "0px",
                    opacity: 0.4
                  }} />
                  <img id="clippedImage" src={`https://media.collage.gent/uploads/full/${item.imageURI}`} style={{
                    top:  50 + (item.clippingData.y) * ratio + "px",
                    left: (item.clippingData.x - (item.clippingData.offsetX / item.clippingData.ratio)) * ratio + "px",
                    width: (item.clippingData.w) * ratio  + "px",
                    height: (item.clippingData.h) * ratio + "px"
                  }} />
                </>
              </div> 
              <div className="informationContainer">
                <table>
                  <tbody>
                    <tr>
                      <td rowSpan="2" style={{borderRight: "1px solid #eee"}}>
                        <div className="headline">
                          <div id="headlineWrap">
                            <div className="origin">
                              {origin.collection}
                              <br />{origin.originID.substr(0, 12)+"..."}
                            </div>
                            <div id="itemID">{id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{borderBottom: "1px solid #eee"}}>
                        <div className="annotations" >
                          <div className="aiAnnotation">{origin.annotation}</div>
                          <div className="originAnnotation">{origin.originalAnnotation}</div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="placementInfo">
                          <div className="pItem"><span>x</span>{Math.round(item.x * 100) / 100}</div>
                          <div className="pItem"><span>y</span>{Math.round(item.y * 100) / 100}</div>
                          <div className="pItem"><span>plaats</span>{item.placedAt ? item.placedAt : "Gent"}</div>
                          <div className="pItem"><span>datum</span>{item.created_at}</div>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan="2">
                        <div className="ctaContainer">
                          <a target="_blanc" href={`https://data.collectie.gent/entity/${origin.collection}:${origin.originID}`} className="cta">vind in de collectie</a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div> 
            </>
          : "loading" }  
        </div>
      </div>
  );
}

export default Detail;
