import React, { Component } from 'react';
import './App.css';
import Chart from './Chart';

class App extends Component {
  state = {
    APIData: [],
    fromYear: 2018
  }

  handleAPIClick = () => {
    fetch('https://api.census.gov/data/timeseries/eits/resconst?get=cell_value,data_type_code,time_slot_id,error_data,category_code,seasonally_adj&time=from+' + this.state.fromYear)
        .then(res => res.json())
        .then((data) => {
          this.setState({
            APIData: data
          });
          console.log(this.state.APIData);
        })
        .catch(console.log)
  };

  render() {
    return (
      <div className="App">
        <button onClick={this.handleAPIClick}>Click to test API</button>
        <div>
          <h2>Data in Console</h2>
          <p>Data is stored in the state as APIData</p>
        </div>
        <Chart />
      </div>
    );
  }
  
}

export default App;
