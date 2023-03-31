
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import logod9 from './../assets/images/logod9.png';
import logouia from './../assets/images/logouia.png';

function Menu(props) {
  const [displayMenu, setDisplayMenu] = useState(false);


  return (
    <>
      <div className="menu">
        <Link to="/">Collage van Gent</Link>
        <div className="hamburger"  onClick={() => setDisplayMenu(!displayMenu)}>
          <a className="gg-menu"></a>
        </div>  
      </div>
      { displayMenu ? 
        <div id="menuOverlay">
          <div className="linkContainer">
            <Link to="/" onClick={() => setDisplayMenu(false)}>Home</Link>
            <Link to="/" onClick={() => setDisplayMenu(false)}>Contact</Link>
          </div>  
          <div className="ctaContainer">
            <a target="_blanc" href={`https://collectie.gent`} className="cta">Bekijk de volledige collectie</a>
          </div>
          <div className="logoContainer">
            <h1>Met de steun van: </h1>
            <img src={logod9} />
            <img src={logouia} />
          </div>
        </div>
      : null }
    </>
  );
}

export default Menu;
