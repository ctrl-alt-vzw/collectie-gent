
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

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
            <Link to="/">Home</Link>
            <Link to="/">Contact</Link>
          </div>  
          <div className="ctaContainer">
            <a target="_blanc" href={`https://collectie.gent`} className="cta">Bekijk de volledige collectie</a>
          </div>
          <div className="logoContainer">
            Logos
          </div>
        </div>
      : null }
    </>
  );
}

export default Menu;
