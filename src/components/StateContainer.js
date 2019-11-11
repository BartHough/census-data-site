import React, { Component } from 'react';
import GMap from './GMap';
import DataForm from './DataForm';
import Chart from './Chart';

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
      tableId: "",
      renderChart: false,
      location: ""
    }
  }

  updateMapState = (latlng, address, stateLong, stateShort, postalCode, region) => {
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

  updateDataTypeState = (dataType) => {
    this.setState({
      ...this.state,
      dataType
    })
  }

  updateCategoryState = (category) => {
    this.setState({
      ...this.state,
      category
    })
  }

  updateTableState = (tableName, dataTypes, categories, tableId, tableData, dropDown, location) => {
    this.setState({
      ...this.state,
      tableName,
      dataTypes,
      categories,
      tableId,
      tableData,
      dropDown,
      location
    })
  }

  updateTimeState = (timeStart, timeEnd, fromYear) => {
    this.setState({
      ...this.state,
      timeStart,
      timeEnd,
      fromYear
    })
  }

  updateGraphState = (graphData, labels, chartData, renderChart) => {
    this.setState({
      ...this.state,
      graphData,
      labels,
      chartData,
      renderChart
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
          region={this.state.region}
          stateShort={this.state.stateShort}
          location={this.state.location}
          updateFormState={this.updateFormState}
          updateCategoryState={this.updateCategoryState}
          updateDataTypeState={this.updateDataTypeState}
          updateGraphState={this.updateGraphState}
          updateTableState={this.updateTableState}
          updateTimeState={this.updateTimeState} />

        {this.state.renderChart && <Chart labels={this.state.labels} data={this.state.chartData} title={this.state.tableName} />}
      </div>
    );
  }
}

export default StateContainer
