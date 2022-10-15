import React, { useEffect } from 'react'
import Loader from './../Common/Loader.jsx'
import Clipping from './Clipping'
import { ManagerContext } from "../Manager/index.js"



function Viewer(props) {

  const [ , dispatch ] = React.useContext(ManagerContext)
  const [data, setData] = React.useState([]);
  const [yOffset, setYOffset] = React.useState([]);

  console.log(process.env.REACT_APP_API_ADDR)
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ADDR}/clipping`)
      .then(r => r.json())
      .then((data) => {
        console.log(data)
        const total = data.reduce((a, b) => a + b.y, 0);
        setYOffset(total / data.length)
        setData(data)
      })
  }, [])


  const handleReturn = () => {
    console.log("init")
    dispatch({ type: "reset_and_select", payload: {} })
  }
  
  return (

    <div id="container">
      {data.length === 0 ? <Loader message="loading clippings" /> : null}
      { data.map((clipping, key) => {
        clipping["zIndex"] = data.length - key;
        clipping["yOffset"] = yOffset;
        return <Clipping clipping_data={clipping} key={key}  />
      })}
      <div id="header">
        <button onClick={handleReturn}>Select your own</button>
      </div>
    </div>
  )
}

export default Viewer;