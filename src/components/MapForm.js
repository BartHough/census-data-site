import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import Geocode from "react-geocode";
import Select from 'react-select';
import {GoogleApiKey} from '../APIKeys';
import "../styles/MapForm.css"

const apiKey = GoogleApiKey;
Geocode.setApiKey(apiKey)

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
      // none of react-select's styles are passed to <Control />
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
        tableId: "",
        fromYear: "",
        graphData: "",
        variable: "",
        timeStart: "",
        timeEnd: "",
      tableData: [],
      dropDown: []
    }
    this.handleTableName = this.handleTableName.bind(this);
    this.handleVariable = this.handleVariable.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.handleTimeStart = this.handleTimeStart.bind(this)
    // this.handleTimeEnd = this.handleTimeEnd.bind(this)
  }

  handleTableName(selectedOption) {
    const tableId = selectedOption.value
    const tableName = selectedOption.label
    // Get the fromYear prop for selected item
    let fromYear
    this.state.tableData.forEach(table => {
      if(table.id === tableId) {
        fromYear = table.fromYear
      }
    })
    this.setState({
        ...this.state,
        tableName,
        tableId,
        fromYear
    })
  }

  handleVariable(event) {
    const variable = event.target.value
    this.setState({ ...this.state, variable })
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name] : evt.target.value
    });
  }

  findRegion(state) {
    const west = ['WA', 'OR', 'CA', 'ID', 'NV', 'MT', 'WY', 'UT', 'CO', 'AZ', 'NM']
    const midwest = ['ND', 'SD', 'NE', 'KS', 'MN', 'IA', 'MO', 'WI', 'IL', 'IN', 'MI', 'OH']
    const south = ['TX', 'OK', 'AR', 'LA', 'MS', 'TN', 'KY', 'WV', 'MD', 'DC', 'DE', 'VA', 'NC', 'SC', 'GA', 'AL', 'FL']
    const northeast = ['PA', 'NJ', 'RI', 'CT', 'NY', 'MA', 'VT', 'NH', 'ME']
    const pacific = ['HI', 'AK']
    if (south.includes(state)) {
      return 'south'
    }
    else if (midwest.includes(state)) {
      return 'midwest'
    }
    else if (west.includes(state)) {
      return 'west'
    }
    else if (northeast.includes(state)) {
      return 'northeast'
    }
    else if (pacific.includes(state)) {
      return 'pacific'
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
    await this.getAPIData();
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

  async getAPIData() {
    fetch('https://api.census.gov/data/timeseries/eits')
      .then(res => res.json())
      .then(data => {
        this.getTables(data)
      })
      .catch(console.log)
  }

  getAPIGraphData = (event) => {
    event.preventDefault()
    fetch(`https://api.census.gov/data/timeseries/eits/${this.state.tableId}?get=cell_value,data_type_code,time_slot_id,error_data,category_code,seasonally_adj&time=from+${this.state.fromYear}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          ...this.state,
          graphData: data
        });
        console.log(this.state.graphData)
        console.log(`fromYear: ${this.state.fromYear}`)
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
    let titles = this.extractDropdownOptions(tableObjects);
    console.log('titles', titles)
    this.setState({
      ...this.state,
      tableData: tableObjects,
      dropDown: titles
    });
    console.log('state table objects', this.state.tableData)
  }

  extractDropdownOptions(tableObjects) {
    let selectOptions = []
    tableObjects.forEach(table => {
      selectOptions.push(
        { value: table.id, label: table.title }
      )
    })
    return selectOptions
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

  addMarker (location, map) {
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
          <form id="formForMap" onSubmit={this.getAPIGraphData} style={style.form}>
            <div className="section"><span>1</span>Select Report</div>
            <div className="inner-wrap"> 
              <Select
                name='tableDropDown'
                placeholder='Select Table'
                style={style.select}
                onChange={this.handleTableName}
                options={this.state.dropDown}
              />
            </div>
            <div className="section"><span>2</span>Time Period</div>
            <div className="inner-wrap">
              <label htmlFor='timeStart'>Time Period Start</label>
              <input 
                name='timeStart' 
                placeholder="Time Period Start" 
                type="date" 
                value={this.state.timeStart} 
                onChange={this.handleChange} 
              />
              <label htmlFor='timeEnd'>Time Period End</label>
              <input 
                name='timeEnd' 
                placeholder="Time Period End" 
                type="date" 
                value={this.state.timeEnd} 
                onChange={this.handleChange} 
              />
            </div>
            <div className="section"><span>3</span>Latitude and Longitude</div>
            <div className="inner-wrap">
              <label htmlFor='latitude'> Latitude </label>
              <input 
                readOnly
                name='latitude' 
                placeholder="Latitude" 
                type="text" 
                value={this.state.latlng.lat} 
              />
              <label htmlFor='longitude'> Longitude </label>
              <input 
                readOnly 
                name='longitude'
                placeholder="Longitude" 
                type="text" 
                value={this.state.latlng.lng} 
              />
            </div>
            <div className="section"><span>4</span>Location</div>
            <div className="inner-wrap">
              <label htmlFor='state'> State </label>
              <input 
                readOnly 
                name='state'
                placeholder="State" 
                type="text" 
                value={this.state.stateLong} 
              />
              <label htmlFor='postalCode'> Postal Code </label>
              <input 
                readOnly 
                name='postalCode'
                placeholder="Postal Code" 
                type="text" 
                value={this.state.postalCode} 
              />
              <label htmlFor='region'> Region </label>
              <input 
                readOnly
                name='region' 
                placeholder="Region" 
                type="text" 
                value={this.state.region} 
              />
            </div>
            <div className="button-section">
              <input type="submit" name="submit" />
            </div>
          </form>
        </div>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: apiKey
})(MapForm)
