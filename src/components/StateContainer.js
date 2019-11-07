import React, { Component } from 'react';
import GMap from './GMap';

export class StateContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      latlng: {
        lat: 41,
        lng: -108.3
      },
      address: "",
      stateLong: "",
      stateShort: "",
      postalCode: "",
      region: "",
      tableName: "",
      fromYear: "",
      graphData: "",
      variable: "",
      timeStart: "",
      timeEnd: "",
      dataType: "",
      category: "",
      labels: [],
      chartData: [],
      tableData: [],
      dropDown: [],
      dataTypes: [],
      categories: [],
      tableId: ""
    }
  }

  updateMapState = (
    latlng,
    address,
    stateLong,
    stateShort,
    postalCode,
    region
  ) => {
      this.setState({
        ...this.state,
        latlng,
        address,
        stateLong,
        stateShort,
        postalCode,
        region
      })
  }

  render() {
    return (
      <div>
          <GMap 
            latlng={this.state.latlng}
            address={this.state.address}
            stateLong={this.state.stateLong}
            stateShort={this.state.stateShort}
            postalCode={this.state.postalCode}
            region={this.state.region}
            updateMapState={this.updateMapState} />
          <p>form</p>
      </div>
    );
  }
}

export default StateContainer
