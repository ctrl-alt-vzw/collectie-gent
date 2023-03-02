import React from 'react'

function Loader(props) {
  return( 
    <div className="loader">
      { props.message ? props.message : "Loading" }
    </div>
  )

}
export default Loader;