import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import Geocode from "react-geocode";
const apiKey = ''
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
        variable: "",
        timeStart: "",
        timeEnd: ""
      }
    }
    this.handleTableName = this.handleTableName.bind(this)
    this.handleVariable = this.handleVariable.bind(this)
    this.handleTimeStart = this.handleTimeStart.bind(this)
    this.handleTimeEnd = this.handleTimeEnd.bind(this)
  }

  handleTableName(event) {
    const tableName = event.target.value
    this.setState({ fields: { ...this.state.fields, tableName } })
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

  addMarker = (location, map) => {
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
            <label>Table Name</label>
            <input placeholder="Table Name" type="text" onChange={this.handleTableName} />
            <label>Variable To View</label>
            <input placeholder="Variable" type="text" onChange={this.handleVariable} />
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
