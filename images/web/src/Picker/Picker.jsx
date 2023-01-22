import React, { useEffect} from 'react'
import Loader from './../Common/Loader.jsx'
import Info from './Info.jsx';

import { ManagerContext } from "../Manager/index.js"
import Application from './Application/Application.js'

function Picker(props) {

  const [ , dispatch ] = React.useContext(ManagerContext)
  const [ data, setData ] = React.useState([]);
  const [ selectedItem, setSelectedItem] = React.useState(null);

useEffect(() => {
    const application = new Application(document.querySelector('canvas.webgl'), setSelectedItem);
    }, []);
  return (
    <div id="pickerContainer">
      { selectedItem ? <Info id={selectedItem} />: null }
      <canvas className='webgl'></canvas>
    </div>
  )

}

export default Picker;

/*
function Picker(props) {

  const [ , dispatch ] = React.useContext(ManagerContext)
  const [ data, setData ] = React.useState([]);

useEffect(() => {
    setData([])
    fetch(`${process.env.REACT_APP_API_ADDR ? process.env.REACT_APP_API_ADDR : "https://api.collage.gent"}/annotation/random`)
      .then(r => r.json())
      .then(data => {
        
        setData(data.splice(0, 100))  
    })  
    }, []);
  return (
    <div id="pickerContainer">
      { data.length === 0 ? <Loader message="Loading posibilities" /> : null}
      { data.map((item, key) => {
        return <Item data={item} key={key} handleElementSelection={() => dispatch({ type: "pick_annotation", payload: item })} />
      })}
    </div>
  )

}

export default Picker;
*/