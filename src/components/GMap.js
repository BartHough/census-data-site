import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import Geocode from "react-geocode";
import "../styles/MapForm.css"
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
Geocode.setApiKey(apiKey)

const style = {
  map: {
    width: '100%',
    height: '100%'
  }
}

class GMap extends Component {

  async componentDidMount() {
    const { lat, lng } = await this.getcurrentLocation();
    const latlng = { lat, lng }
    this.props.updateMapState(
      latlng,
      this.props.address,
      this.props.stateLong,
      this.props.stateShort,
      this.props.postalCode,
      this.props.region
    );
    this.updateFields(lat, lng);
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
          const latlng = { lat, lng }
          this.props.updateMapState(
            latlng,
            address,
            stateLong,
            stateShort,
            postalCode,
            region
          )
        }
      )
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
      <div style={{ position: 'relative', width: '100vw', height: '50vh' }}>
        <Map
          google={this.props.google}
          style={style.map}
          initialCenter={this.props.latlng}
          center={this.props.latlng}
          zoom={4}
          onClick={(t, map, c) => this.addMarker(c.latLng, map)}>
          <Marker position={this.props.latlng} />
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: apiKey
})(GMap)
