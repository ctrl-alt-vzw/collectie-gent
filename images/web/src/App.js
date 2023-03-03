
import React, { useEffect, useState } from 'react';

import './assets/css/App.css';
import './assets/css/viewer.css';

import Menu from './Common/Menu.jsx'
import Clipping from './Components/Clipping.jsx'
import Viewer from './Viewer/Viewer.jsx'


function App(props) {


  return (
      <div className="App">
        <Menu />
        <Viewer />
      </div>
  );
}

export default App;
