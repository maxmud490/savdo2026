import React from 'react';
import { RotatingLines } from 'react-loader-spinner';


function Loader() {
  return (
    <div className="loader-container">
      <RotatingLines
        visible={true}
        height="96"
        width="96"
        color="blue"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
        wrapperStyle={{}}
        wrapperClass=""
         
      />
    </div>
  );
}

export default Loader;
