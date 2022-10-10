import React from 'react';

import './assets/css/App.css';
import Picker from './Picker/Picker.jsx'
import Cutter from './Cutter/Cutter.jsx'
import Dropper from './Dropper/Dropper.jsx'
import Viewer from './Viewer/Viewer.jsx'

import { ManagerContext } from "./Manager/index.js"

function App(props) {
  const [ state ] = React.useContext(ManagerContext)
  console.log(state)
  return (
      <div className="App">
        { state.phase === 0 ? 
          <Picker /> : null
        }
        { state.phase === 1 && state.annotation ? 
          <Cutter /> : null
        }
        { state.phase === 2 && state.clipping ? 
          <Dropper /> : null
        }
        { state.phase === 3 ? 
          <Viewer /> : null
        }
      </div>
  );
}

export default App;
