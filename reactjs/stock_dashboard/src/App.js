// import Button from 'react-bootstrap/Button';
import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const App = () => {

  // const handleClickChangeSocketUrl = useCallback(
  //   () => setSocketUrl('ws://demos.kaazing.com/echo'),
  //   []
  // );

  // handleClickChangeSocketUrl = () => {
  //   console.log('You clicked submit.');
  // }

  return (
    <div>
      <button>
        Click Me to change Socket Url
      </button>
    </div>
  );
}

export default App;
