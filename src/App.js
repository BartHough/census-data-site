import React from 'react';
import MapForm from './components/MapForm'
import './App.css';
import Chart from './components/Chart';

function App() {
  return (
    <div className="App">
      <div>
        <MapForm />
      </div>
      <div>
        <Chart />
      </div>
    </div>
  );
}

export default App;
