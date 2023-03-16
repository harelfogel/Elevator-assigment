import React from 'react';
import './App.css';
import { Building } from './components/Building';

function App() {
  return (
    <div className="App">
        <h1 className="app-title">Elevator System</h1>
        <Building/>
    </div>
  );
}

export default App;