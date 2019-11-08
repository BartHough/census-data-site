import React, { Component } from 'react';
import GMap from './GMap';
import DataForm from './DataForm';

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

  updateDataTypeState(dataType) {
    this.setState({
      ...this.state,
      dataType
    })
  }

  updateCategoryState(category) {
    this.setState({
      ...this.state,
      category
    })
  }

  updateFormState = (
    tableName,
    fromYear,
    graphData,
    timeStart,
    timeEnd,
    category,
    labels,
    chartData,
    tableData,
    dropDown,
    dataTypes,
    categories,
    tableId
  ) => {
    this.setState({
      ...this.state,
      tableName,
      fromYear,
      graphData,
      timeStart,
      timeEnd,
      dataType,
      category,
      labels,
      chartData,
      tableData,
      dropDown,
      dataTypes,
      categories,
      tableId
    })
  }

  updateGraphDataState(

  ) {

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
          <DataForm
            tableName={this.state.tableName}
            fromYear={this.state.fromYear}
            graphData={this.state.graphData}
            timeStart={this.state.timeStart}
            timeEnd={this.state.timeEnd}
            dataType={this.state.dataType}
            category={this.state.category}
            labels={this.state.labels}
            chartData={this.state.chartData}
            tableData={this.state.tableData}
            dropDown={this.state.dropDown}
            dataTypes={this.state.dataTypes}
            categories={this.state.categories}
            tableId={this.state.tableId}
            updateFormState={this.updateFormState} />
      </div>
    );
  }
}

export default StateContainer
