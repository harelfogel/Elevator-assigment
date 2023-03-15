import React from 'react';
import './App.css';
import { Building } from './components/Building';
import { ElevatorProvider } from './contexts/ElevatorContext';


function App() {
  return (
    <div className="App">
      <h1 className="app-title">Elevator System</h1>
      <ElevatorProvider>
        <Building />
      </ElevatorProvider>
    </div>
  );
}

export default App;