import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import Geocode from "react-geocode";
import Select from 'react-select';
import {GoogleApiKey} from '../APIKeys';

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
      fields: {
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
        tableUrl: "",
        variable: "",
        timeStart: "",
        timeEnd: ""
      },
      tableData: [],
      dropDown: []
    }
    this.handleTableName = this.handleTableName.bind(this)
    this.handleVariable = this.handleVariable.bind(this)
    this.handleTimeStart = this.handleTimeStart.bind(this)
    this.handleTimeEnd = this.handleTimeEnd.bind(this)
  }

  handleTableName(selectedOption) {
    const tableUrl = selectedOption.value
    const tableName = selectedOption.label
    this.setState({
      fields: {
        ...this.state.fields,
        tableName,
        tableUrl
      }
    })
  }

  handleVariable(event) {
    const variable = event.target.value
    this.setState({ fields: { ...this.state.fields, variable } })
  }

  handleTimeStart(event) {
    const timeStart = event.target.value
    this.setState({ fields: { ...this.state.fields, timeStart } })
  }

  handleTimeEnd(event) {
    const timeEnd = event.target.value
    this.setState({ fields: { ...this.state.fields, timeEnd } })
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
            fields: {
              ...this.state.fields,
              latlng: {
                lat,
                lng
              },
              address,
              stateLong,
              stateShort,
              postalCode,
              region
            }
          })
        }
      )
  }

  async componentDidMount() {
    const { lat, lng } = await this.getcurrentLocation();
    await this.getAPIData();
    this.setState(prev => ({
      fields: {
        ...prev.fields,
        latlng: {
          lat,
          lng
        }
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

  getTables(apiData) {
    let tableObjects = []
    apiData.dataset.forEach(table => {
      const newObj = {
        "id": table.c_dataset[2], // id needed for graph data API call URL
        "title": table.title.split(': ')[1], // takes table title description after ': '
        "varLink": table.c_variablesLink
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
        { value: table.varLink, label: table.title }
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
          initialCenter={this.state.fields.latlng}
          center={this.state.fields.latlng}
          zoom={4}
          onClick={(t, map, c) => this.addMarker(c.latLng, map)}
        >
          <Marker position={this.state.fields.latlng} />
          <form style={style.form}>
            <Select
              placeholder='Select Table'
              style={style.select}
              onChange={this.handleTableName}
              options={this.state.dropDown}
            />
            <br></br>
            <label>Time Period Start</label>
            <input placeholder="Time Period Start" type="date" value={this.state.fields.timeStart} onChange={this.handleTimeStart} />
            <label>Time Period End</label>
            <input placeholder="Time Period End" type="date" value={this.state.fields.timeEnd} onChange={this.handleTimeEnd} />
            <br></br>
            <label> Latitude </label>
            <input readOnly placeholder="Latitude" type="text" value={this.state.fields.latlng.lat} />
            <label> Longitude </label>
            <input readOnly placeholder="Longitude" type="text" value={this.state.fields.latlng.lng} />
            <label> State </label>
            <input readOnly placeholder="State" type="text" value={this.state.fields.stateLong} />
            <br></br>
            <label> Postal Code </label>
            <input readOnly placeholder="Postal Code" type="text" value={this.state.fields.postalCode} />
            <label> Region </label>
            <input readOnly placeholder="Region" type="text" value={this.state.fields.region} />
            <br></br>
            <input value="Submit" type="submit" />
          </form>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: apiKey
})(MapForm)
