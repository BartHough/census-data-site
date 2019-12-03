import React, { Component } from "react";
import Select from "react-select";
import "../styles/MapForm.css";

const CATEGORY_CODE = 0;
const DATA_TYPE_CODE = 1;
const GEO_LEVEL_CODE = 2;

const style = {
  form: {
    margin: "20px"
  },
  select: {
    control: () => ({
      width: 50
    })
  }
};

class DataForm extends Component {
  constructor(props) {
    super(props);
    this.handleTableName = this.handleTableName.bind(this);
  }

  async componentDidMount() {
    await this.getAPIData();
  }

  handleDataType = selectedOption => {
    console.log(selectedOption);
    const dataType = selectedOption.value;
    this.props.updateDataTypeState(dataType, selectedOption);
  };

  handleCategory = selectedOption => {
    const category = selectedOption.value;
    this.props.updateCategoryState(category, selectedOption);
  };

  async handleTableName(selectedOption) {
    const tableId = selectedOption.value;
    const tableName = selectedOption.label;
    let location = "US";
    const data = await import(`../apiJsons/${tableId}.json`);

    let dataTypes = this.extractCategoryDataDropdownOptions(
      data.default[tableId][DATA_TYPE_CODE].data_type_code
    );
    let categories = this.extractCategoryDataDropdownOptions(
      data.default[tableId][CATEGORY_CODE].category_code
    );
    let geoLevelCodes = this.extractCategoryDataDropdownOptions(
      data.default[tableId][GEO_LEVEL_CODE].geo_level_code
    );
    if (geoLevelCodes.length === 5) {
      location = this.props.region;
    }
    // else if (geoLevelCodes.length > 5) {
    //   location = this.props.stateShort;
    // }
    this.props.updateTableState(tableName,
      dataTypes,
      categories,
      tableId,
      this.props.tableData,
      this.props.dropDown,
      location
    );
  }

  handleChange = event => {
    const timeStart = event.target.value;
    const fromYear = timeStart.split("-")[0];
    this.props.updateTimeState(timeStart, this.props.timeEnd, fromYear);
  };

  getAPIGraphData = event => {
    this.props.updateLoading(true);
    event.preventDefault();
    let apiUrl;
    if (
      this.props.tableId === "advm3" ||
      this.props.tableId === "bfs" ||
      this.props.tableId === "m3" ||
      this.props.tableId === "mhs2"
    ) {
      apiUrl = `https://api.census.gov/data/timeseries/eits/${this.props.tableId}?get=cell_value,data_type_code,time_slot_id,error_data,category_code,seasonally_adj,geo_level_code&time=from+${this.props.fromYear}&for=US`;
    } else {
      apiUrl = `https://api.census.gov/data/timeseries/eits/${this.props.tableId}?get=cell_value,data_type_code,time_slot_id,error_data,category_code,seasonally_adj,geo_level_code&time=from+${this.props.fromYear}`;
    }
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        this.parseApiResponse(data);
      })
      .catch(console.log);
  };

  getTables = apiData => {
    let tableData = [];

    apiData.dataset.forEach(table => {
      if (table.c_dataset[2] !== "hv" && table.c_dataset[2] !== "mhs") {
        const newObj = {
          id: table.c_dataset[2], // id needed for graph data API call URL
          title: table.title.split(": ")[1], // takes table title description after ': '
          varLink: table.c_variablesLink,
          fromYear: table.temporal.match(/[1|2]\d+/g).map(Number)[0] // parses 1000/2000 years from string ex. 1968, 2005
        };
        tableData.push(newObj);
      }
    });

    let dropDown = this.extractTableDropdownOptions(tableData);

    this.props.updateTableState(
      this.props.tableName,
      this.props.dataTypes,
      this.props.categories,
      this.props.tableId,
      tableData,
      dropDown
    );
  };

  extractTableDropdownOptions = tableObjects => {
    let selectOptions = [];
    tableObjects.forEach(table => {
      selectOptions.push({ value: table.id, label: table.title });
    });
    return selectOptions;
  };

  extractCategoryDataDropdownOptions = objects => {
    let selectOptions = [];
    objects.forEach(obj => {
      selectOptions.push({ value: obj.id, label: obj.description });
    });
    return selectOptions;
  };

  async getAPIData() {
    fetch("https://api.census.gov/data/timeseries/eits")
      .then(res => res.json())
      .then(data => {
        this.getTables(data);
      })
      .catch(console.log);
  }

  invalidComboAlert = () => {
    alert(
      "There is no data for the combination you selected. Please try another combination."
    );
  };

  parseApiResponse = data => {
    let labels = [];
    let chartData = [];
    data.forEach(row => {
      if (
        row[1] === this.props.dataType &&
        row[4] === this.props.category &&
        row[5] === "no" &&
        row[6] === this.props.location
      ) {
        chartData.push(row[0]);
        labels.push(row[7]);
      }
    });
    if (chartData.length === 0 || labels.length === 0) {
      this.invalidComboAlert();
      return;
    }
    this.props.updateGraphState(this.props.graphData, labels, chartData, true);
    this.props.updateLoading(false);
    this.getAvgData(labels, chartData);
  };

  getAvgData(allLabels, allData) {
    let labels = allLabels;
    let months = false;
    if (this.props.tableName.includes('Quarterly')) {
      labels = ['Q1', 'Q2', 'Q3', 'Q4'];
    }
    else {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      months = true;
    }
    let avgData = [];
    labels.forEach(label => {
      let search = '';
      if (months) {
        let temp = labels.indexOf(label) + 1;
        if (temp < 10) {
          search = temp.toString();
          search = '0' + search;
        }
        else {
          search = temp.toString();
        }
      }
      else {
        search = label;
      }
      let avg = 0;
      let count = 0;
      let sum = 0;
      this.props.labels.forEach((dataPoint, index) => {
        let temp = dataPoint;
        if (months) {
          temp = dataPoint.split('-')[1];
        }
        if (temp === search) {
          sum += parseInt(allData[index]);
          count += 1;
        }
      })
      avg = sum / count;
      avgData.push(avg);
      console.log(search + ' ' + avg);
    })
    let render = false;
    if (avgData.length > 1) {
      render = true;
    }
    avgData.forEach(data => {
      if (!data) {
        render = false;
      }
    })
    this.props.updateAvgData(labels, avgData, render);
  }

  render() {
    return (
      <div>
        <div className="mapForm">
          <h1>
            Please Select a Report
            <span>
              Make sure to fill out the time period you would like to see.
            </span>
          </h1>
          <form onSubmit={this.getAPIGraphData} style={style.form}>
            <Select
              placeholder="Select Table"
              style={style.select}
              onChange={this.handleTableName}
              options={this.props.dropDown}
            />
            {!this.props.disabled && (
              <input
                tabIndex={-1}
                autoComplete="off"
                style={{ opacity: 0, height: 0 }}
                value={this.props.tableName}
                required={true}
              />
            )}
            <Select
              placeholder="Select Data Type"
              style={style.select}
              onChange={this.handleDataType}
              options={this.props.dataTypes}
              value={this.props.dataTypeValue}
            />
            {!this.props.disabled && (
              <input
                tabIndex={-1}
                autoComplete="off"
                style={{ opacity: 0, height: 0 }}
                value={this.props.dataTypeValue}
                required={true}
              />
            )}
            <Select
              placeholder="Select Category"
              style={style.select}
              onChange={this.handleCategory}
              options={this.props.categories}
              value={this.props.categoryValue}
            />
            {!this.props.disabled && (
              <input
                tabIndex={-1}
                autoComplete="off"
                style={{ opacity: 0, height: 0 }}
                value={this.props.categoryValue}
                required={true}
              />
            )}
            <div className="inner-wrap">
              <label htmlFor="timeStart">Time Period Start</label>
              <input
                name="timeStart"
                placeholder="Time Period Start"
                type="date"
                value={this.props.timeStart}
                onChange={this.handleChange}
                min='1950-01-01'
                max='2018-12-31'
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

export default DataForm;
