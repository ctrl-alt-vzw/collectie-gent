import React, { useEffect } from 'react'
import Loader from './../Common/Loader.jsx'
import Clipping from './Clipping'
import SocketClient from './SocketClient'

function Projection(props) {
  const [data, setData] = React.useState([]);
  const [yOffset, setYOffset] = React.useState([]);


  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ADDR}/clipping`)
      .then(r => r.json())
      .then((data) => {
        const total = data.reduce((a, b) => a + b.y, 0);
        setYOffset(total / data.length)
        setData(data)
      })

    // const client = new SocketClient();
  }, [])


  return (

    <div id="container">
      {data.length === 0 ? <Loader message="loading clippings" /> : null}
      { data.map((clipping, key) => {
        clipping["zIndex"] = data.length - key;
        clipping["yOffset"] = yOffset;
        return <Clipping clipping_data={clipping} key={key}  />
      })}
    </div>
  )
}

export default Projection;