
import React, { useEffect, useState } from 'react';

import './assets/css/App.css';

import Menu from './Common/Menu.jsx'
import Clipping from './Components/Clipping.jsx'


function App(props) {
  const [clippings, setClippings] =  useState([])

  useEffect(() => {
    fetch(`https://api.collage.gent/clipping`)
      .then((r) => r.json())
      .then((data) => {
        console.log(data)
        setClippings(data);
      })
  }, [])

  return (
      <div className="App">
        <Menu />
        { clippings.map((c, i) => {
          return <Clipping data={c} key={i} />
        })}
      </div>
  );
}

export default App;
