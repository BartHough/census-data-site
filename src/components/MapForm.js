import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import Geocode from "react-geocode";
import Select from 'react-select';
import { GoogleApiKey } from '../APIKeys';
import ChartWrapper from './ChartWrapper'
import "../styles/MapForm.css"
const apiKey = GoogleApiKey;
Geocode.setApiKey(apiKey)

const tables = [
  { value: "resconst", label: "New Residential Construction" },
  { value: "ressales", label: "New Home Sales" }
]
const dtcResconst = [
  { value: "TOTAL", label: "Total Units" },
  { value: "SINGLE", label: "Single-Family Units" },
  { value: "MULTI", label: "Units in Buildings with 5 Units or More" }
]
const dtcRessales = [
  { value: "TOTAL", label: "All Houses" },
  { value: "COMPED", label: "Houses That Are Completed" },
  { value: "UNDERC", label: "Houses That Are Under Construction" },
  { value: "NOTSTD", label: "Houses That Are Not Started" }
]

const ccResconst = [
  { value: "COMPLETIONS", label: "Housing Units Completed" },
  { value: "UNDERCONST", label: "Housing Units Under Construction" },
  { value: "STARTS", label: "Housing Units Started" }
]
const ccRessales = [
  { value: "SOLD", label: "New Single-Family Houses Sold" },
  { value: "FORSALE", label: "New Single-Family Houses For Sale" }
]


const style = {
  map: {
    width: '100%',
    height: '50%',
    display: 'inline-block',
    position: 'relative',
    top: '10px',
    margin: '0 0 10px 0'
  },
  form: {
    margin: '20px'
  },
  select: {
    control: () => ({
      width: 50
    })
  }
}


export class MapForm extends Component {

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
      dropDown: tables,
      dataTypes: [],
      categories: [],
      tableId: ""
    }
    this.handleTableName = this.handleTableName.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDataType = this.handleDataType.bind(this)
    this.handleCategory = this.handleCategory.bind(this)
  }
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

  handleTableName(selectedOption) {
    const tableId = selectedOption.value
    const tableName = selectedOption.label
    console.log(tableName)
    let dataTypes
    let categories
    if (tableId === "resconst") {
      dataTypes = dtcResconst;
      categories = ccResconst;
    }
    else {
      dataTypes = dtcRessales;
      categories = ccRessales;
    }
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

  findRegion(state) {
    const west = ['WA', 'OR', 'CA', 'ID', 'NV', 'MT', 'WY', 'UT', 'CO', 'AZ', 'NM']
    const midwest = ['ND', 'SD', 'NE', 'KS', 'MN', 'IA', 'MO', 'WI', 'IL', 'IN', 'MI', 'OH']
    const south = ['TX', 'OK', 'AR', 'LA', 'MS', 'TN', 'KY', 'WV', 'MD', 'DC', 'DE', 'VA', 'NC', 'SC', 'GA', 'AL', 'FL']
    const northeast = ['PA', 'NJ', 'RI', 'CT', 'NY', 'MA', 'VT', 'NH', 'ME']
    const pacific = ['HI', 'AK']
    if (south.includes(state)) {
      return 'SO'
    }
    else if (midwest.includes(state)) {
      return 'MW'
    }
    else if (west.includes(state)) {
      return 'WE'
    }
    else if (northeast.includes(state)) {
      return 'NE'
    }
    else if (pacific.includes(state)) {
      return 'WE'
    }
    return ""
  }

  updateFields(lat, lng) {
    Geocode.fromLatLng(lat, lng)
      .then(
        response => {
          let postalCode = ""
          let stateLong = ""
          let stateShort = ""
          const addressComponents = response.results[0].address_components;
          const address = response.results[0].formatted_address;
          addressComponents.forEach(component => {
            if (component['types'][0] === 'postal_code') {
              postalCode = component['long_name']
            }
            else if (component['types'][0] === 'administrative_area_level_1') {
              stateLong = component['long_name']
              stateShort = component['short_name']
            }
          });
          const region = this.findRegion(stateShort)
          this.setState({
            ...this.state,
            latlng: {
              lat,
              lng
            },
            address,
            stateLong,
            stateShort,
            postalCode,
            region
          })
        }
      )
  }

  async componentDidMount() {
    const { lat, lng } = await this.getcurrentLocation();
    this.setState(prev => ({
      ...prev,
      latlng: {
        lat,
        lng
      },
      currentLocation: {
        lat,
        lng
      }
    }));
    this.updateFields(lat, lng)
  }

  getAPIGraphData = (event) => {
    event.preventDefault()
    fetch(`https://api.census.gov/data/timeseries/eits/${this.state.tableId}?get=cell_value,data_type_code,time_slot_id,error_data,category_code,seasonally_adj,geo_level_code&time=from+${this.state.fromYear}`)
      .then(res => res.json())
      .then(data => {
        this.parseApiResponse(data)
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

  // Adapted from answer posted by github user Mostafasaffari: https://github.com/fullstackreact/google-maps-react/issues/192
  getcurrentLocation() {
    if (navigator && navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(pos => {
          const coords = pos.coords;
          resolve({
            lat: coords.latitude,
            lng: coords.longitude
          });
        });
      });
    }
    return {
      lat: 0,
      lng: 0
    };
  }

  addMarker(location, map) {
    this.updateFields(location.lat(), location.lng());
    map.panTo(location);
  };

  render() {
    return (
      <div>
        <Map
          google={this.props.google}
          style={style.map}
          initialCenter={this.state.latlng}
          center={this.state.latlng}
          zoom={4}
          onClick={(t, map, c) => this.addMarker(c.latLng, map)}
        >
          <Marker position={this.state.latlng} />
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
                />
                <div className="button-section">
                  <input value="Submit" type="submit" />
                </div>
              </div>
            </form>
          </div>
          <ChartWrapper data={this.state.chartData} labels={this.state.labels} title={this.state.tableName} />
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: apiKey
})(MapForm)
