import React, { useEffect} from 'react'
import Loader from './../Common/Loader.jsx'
import Item from './Item.jsx'

import { ManagerContext } from "../Manager/index.js"

function Picker(props) {

  const [ , dispatch ] = React.useContext(ManagerContext)
  const [ data, setData ] = React.useState([]);

useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ADDR}/annotation/random`)
      .then(r => r.json())
      .then(data => {

        setData(data.splice(0, 100))  
    })  
    }, []);
  return (
    <div id="container">
      { data.length === 0 ? <Loader message="Loading posibilities" /> : null}
      { data.map((item, key) => {
        return <Item data={item} key={key} handleElementSelection={() => dispatch({ type: "pick_annotation", payload: item })} />
      })}
    </div>
  )

}

export default Picker;