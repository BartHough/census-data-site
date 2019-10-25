import React, { Component } from 'react';
import APIHelper from './APIHelper';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      APIData: [],
      graphData: [],
      fromYear: 2018
    }
  }
  

  async componentDidMount() {
    let APIData
    APIHelper.testFunc(APIData);
    console.log(APIData);
    console.log(this.state.APIData);
  }

  handleAPIClick = () => {
    fetch('https://api.census.gov/data/timeseries/eits/resconst?get=cell_value,data_type_code,time_slot_id,error_data,category_code,seasonally_adj&time=from+' + this.state.fromYear)
        .then(res => res.json())
        .then((data) => {
          this.setState({
            graphData: data
          });
          console.log(this.state.graphData);
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
      </div>
    );
  }
  
}

export default App;
