import React from 'react';
// import logo from './logo.svg';
import './App.css';

import {VisualTimer} from "./visual-timer/components/visual-timer/VisualTimer";

function App() {
  return (
    <div className="App">
        <VisualTimer seconds={10} showHours={false} />
    </div>
  );
}

export default App;
