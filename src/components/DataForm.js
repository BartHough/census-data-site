import React, { Component } from 'react';
import Select from 'react-select';
import "../styles/MapForm.css"

const CATEGORY_CODE = 0;
const DATA_TYPE_CODE = 1;
const GEO_LEVEL_CODE = 2;

const style = {
  form: {
    margin: '20px'
  },
  select: {
    control: () => ({
      width: 50
    })
  }
}

class DataForm extends Component {

  handleDataType(selectedOption) {
    const dataType = selectedOption.value;
    this.setState({
      ...this.state,
      dataType

    })
  }
  handleCategory(selectedOption) {
    const category = selectedOption.value;
    this.setState({
      ...this.state,
      category
    })
  }

  async handleTableName(selectedOption) {
    const tableId = selectedOption.value
    const tableName = selectedOption.label
    
    const data = await import(`../apiJsons/${tableId}.json`)

    let dataTypes = this.extractCategoryDataDropdownOptions(data.default[tableId][DATA_TYPE_CODE].data_type_code);
    let categories = this.extractCategoryDataDropdownOptions(data.default[tableId][CATEGORY_CODE].category_code);

    console.log(dataTypes);
    console.log(categories);

    this.setState({
      ...this.state,
      tableName,
      dataTypes,
      categories,
      tableId
    })
  }

  handleChange(event) {
    const timeStart = event.target.value
    const fromYear = timeStart.split('-')[0]
    this.setState({
      ...this.state,
      timeStart,
      fromYear
    })
  }

  getAPIGraphData = (event) => {
    event.preventDefault()
    fetch(`https://api.census.gov/data/timeseries/eits/${this.state.tableId}?get=cell_value,data_type_code,time_slot_id,error_data,category_code,seasonally_adj,geo_level_code&time=from+${this.state.fromYear}`)
      .then(res => res.json())
      .then(data => {
        this.parseApiResponse(data);
      })
      .catch(console.log)
  }

  getTables(apiData) {
    let tableObjects = []
    apiData.dataset.forEach(table => {
      const newObj = {
        "id": table.c_dataset[2], // id needed for graph data API call URL
        "title": table.title.split(': ')[1], // takes table title description after ': '
        "varLink": table.c_variablesLink,
        "fromYear": table.temporal.match(/[1|2]\d+/g).map(Number)[0] // parses 1000/2000 years from string ex. 1968, 2005
      }
      tableObjects.push(newObj);
    });
    let titles = this.extractTableDropdownOptions(tableObjects);
    console.log('titles', titles)
    this.setState({
      ...this.state,
      tableData: tableObjects,
      dropDown: titles
    });
    console.log('state table objects', this.state.tableData)
  }

  extractTableDropdownOptions(tableObjects) {
    let selectOptions = []
    tableObjects.forEach(table => {
      selectOptions.push(
        { value: table.id, label: table.title }
      )
    })
    return selectOptions
  }

  extractCategoryDataDropdownOptions(objects) {
    let selectOptions = []
    objects.forEach(obj => {
      selectOptions.push(
        { value: obj.id, label: obj.description }
      )
    })
    return selectOptions
  }

  async getAPIData() {
    fetch('https://api.census.gov/data/timeseries/eits')
      .then(res => res.json())
      .then(data => {
        this.getTables(data)
      })
      .catch(console.log)
  }

  parseApiResponse(data) {
    let labels = []
    let chartData = []
    data.forEach(row => {
      if (row[1] === this.state.dataType && row[4] === this.state.category && row[5] === "no" && row[6] === this.state.region) {
        chartData.push(row[0]);
        labels.push(row[7])
      }
    })
    this.setState({
      ...this.state,
      labels,
      chartData
    })
  }

  render() {
    return (
      <div>
        <div className="mapForm">
        <h1>Please Select a Report<span>Make sure to fill out the time period you would like to see.</span></h1>
        <form onSubmit={this.getAPIGraphData} style={style.form}>
            <Select
            placeholder='Select Table'
            style={style.select}
            onChange={this.handleTableName}
            options={this.state.dropDown}
            />
            <Select
            placeholder='Select Data Type'
            style={style.select}
            onChange={this.handleDataType}
            options={this.state.dataTypes}
            />
            <Select
            placeholder='Select Category'
            style={style.select}
            onChange={this.handleCategory}
            options={this.state.categories}
            />
            <div className="inner-wrap">
            <label htmlFor='timeStart'>Time Period Start</label>
            <input
                name='timeStart'
                placeholder="Time Period Start"
                type="date"
                value={this.state.timeStart}
                onChange={this.handleChange}
                required
            />
            <div className="button-section">
                <input value="Submit" type="submit" />
            </div>
            </div>
        </form>
        </div>
      </div>
    );
  }
}

export default DataForm
