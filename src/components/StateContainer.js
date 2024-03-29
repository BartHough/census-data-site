import React, { Component } from 'react';
import GMap from './GMap';
import DataForm from './DataForm';
import Chart from './Chart';
import Spinner from './Spinner';
import AverageChart from './AverageChart';

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
      renderAvg: false,
      avgData: [],
      avgLabels: [],
      loading: false,
      location: "",
      dataTypeValue: "",
      categoryValue: ""
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

  updateDataTypeState = (dataType, dataTypeValue) => {
    this.setState({
      ...this.state,
      dataType,
      dataTypeValue
    })
  }

  updateCategoryState = (category, categoryValue) => {
    this.setState({
      ...this.state,
      category,
      categoryValue
    })
  }

  updateTableState = (tableName, dataTypes, categories, tableId, tableData, dropDown, location) => {
    const dataTypeValue = null;
    const categoryValue = null;
    this.setState({
      ...this.state,
      tableName,
      dataTypes,
      categories,
      tableId,
      tableData,
      dropDown,
      location,
      dataTypeValue,
      categoryValue
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

  updateLoading = (loading) => {
    this.setState({
      ...this.state,
      loading
    })
  }

  updateAvgData = (avgLabels, avgData, renderAvg) => {
    this.setState({
      ...this.state,
      avgLabels,
      avgData,
      renderAvg
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
          updateMapState={this.updateMapState}
        />
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
          dataTypeValue={this.state.dataTypeValue}
          categoryValue={this.state.categoryValue}
          updateFormState={this.updateFormState}
          updateCategoryState={this.updateCategoryState}
          updateDataTypeState={this.updateDataTypeState}
          updateGraphState={this.updateGraphState}
          updateTableState={this.updateTableState}
          updateTimeState={this.updateTimeState}
          updateLoading={this.updateLoading}
          updateAvgData={this.updateAvgData}
        />
        <div>
          {
            this.state.loading &&
            <Spinner />
          }
        </div>
        {
          this.state.renderChart &&
          !this.state.loading &&
          <Chart
            labels={this.state.labels}
            data={this.state.chartData}
            title={this.state.tableName}
          />
        }
        {
          this.state.renderAvg &&
          !this.state.loading &&
          this.state.avgData.length > 0 &&
          <AverageChart
            labels={this.state.avgLabels}
            data={this.state.avgData}
            title={this.state.tableName}
          />
        }
      </div>
    );
  }
}

export default StateContainer
