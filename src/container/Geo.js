import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
// import { Redirect, Route, Switch } from 'react-router-dom'
import {
  Map, TileLayer, CircleMarker, ZoomControl,
  FeatureGroup, GeoJSON, Marker } from 'react-leaflet'
// import { EditControl } from 'react-leaflet-draw'
import * as L from 'leaflet'

import {
  geoLocationFailed, geoLocationUpdate, lastCenterUpdate,
} from '../actions'
import { loggedIn } from '../reducers/auth'
// import FloatPane from '../components/FloatPane'
import store from '../store'

import ContextMenu from '../components/ContextMenu'
import Routing from '../components/Routing'
import { MAPBOX_URL } from '../constants/Api'


const FullPageBox = styled.div`
height: 100%;
min-height: 100vh;
z-index: 1;
flex: 1;
display: flex;
flex-direction: column;
`

const FollowMyLocation = styled.div`
width: 40px
height: 40px;
background: #fefefebb;
border-radius: 10px;
color: #209cee;
position: fixed;
text-align: center;
padding-top: 10px;
right: 0;
bottom: 150px;
z-index: 30;
background: #ffffffaa;
`

const stopIcon = L.divIcon({
  className: 'divIcon',
  html: '<div><img src="//static.traffy.xyz/icon/bus-stop-48.png" width="24" height="24"></div>',
  popupAnchor: [2, -22],
  iconAnchor: [12, 23]
})


const mintStopIcon = L.icon({
  iconUrl: '//static.10ninox.com/map/mint-marker-icon.png',
  iconRetinaUrl: '//static.10ninox.com/map/mint-marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 40],
  popupAnchor: [2, -22],
})

const dragableIcon = L.icon({
  iconUrl: '//static.10ninox.com/map/pink-marker-icon.png',
  iconRetinaUrl: '//static.10ninox.com/map/pink-marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 40],
  popupAnchor: [2, -22],
})


class Geo extends Component {

  state = {
    top: 0,
    left: 0,
    visible: false,
    coords: [],
  }
  // constructor(props) {
  //   super(props)
  // }

  componentWillMount() {
    this.setState({ mapCenter: this.props.geo.mapCenter })
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID)
  }

  componentDidMount() {
    /* if (!navigator.geolocation) {
      getCurrentPosition: (success, failure) => {
        const failureMsg = "Your browser doesn't support geolocation."
        console.log(success, failure)
        // failure(dispatch(locationError(failureMsg)))
      }
    } */
    navigator.geolocation.getCurrentPosition(
      (position) => store.dispatch(geoLocationUpdate(position)),
      (error) => store.dispatch(geoLocationFailed(error)),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 },
    )
    this.watchID = navigator.geolocation.watchPosition(
      (position) => store.dispatch(geoLocationUpdate(position)),
      (error) => store.dispatch(geoLocationFailed(error)),
    )
  }

  componentWillReceiveProps(newProps) {
    const omCenter = this.props.geo.mapCenter
    const newCenter = newProps.geo.mapCenter
    let center = {
      lastCenter: newProps.geo.lastCenter
    }
    if (omCenter[0] !== newCenter[0] || omCenter[1] !== newCenter[1]) {
      center.mapCenter = newCenter
    }
    this.setState(center)
  }

  renderGeoJSON() {
    const { polygons } = this.props.geo
    const style = {
      color: '#a63eff',
      weight: 5,
      opacity: 0.65
    }
    return (
      <FeatureGroup>
        {polygons && polygons.filter(ele => ele.geojson).map(ele => (
          <GeoJSON
            key={`geojson-${ele.id}`}
            data={ele.geojson}
            style={{...style, ...ele.style}} />
        ))}
      </FeatureGroup>
    )
  }

  renderStopTime() {
    const { count, results } = this.props.stoptime
    if (count === 0)
      return
    let stopFeatures = {
      "type": "FeatureCollection",
      "features": []
    }
    results.forEach(ele => {
      stopFeatures.features.push({
        "type": "Feature",
        "properties": {
          "popupContent": `${ele.stop.name} - ${ele.arrival}`,
          "stop_id": `${ele.stop.stop_id}`,
          "icon": stopIcon,
        },
        "geometry": ele.stop.geojson,
      })
    })
    return <GeoJSON
              key={`stoptime-${results[0].id}-${results[count-1].id}`}
              data={stopFeatures}
              pointToLayer={(feat, latlon) => {
                return (
                  L.marker(latlon, {
                    icon: feat.properties.icon
                  }).bindPopup(`<a href="/#/map/stop/${feat.properties.stop_id}">${feat.properties.popupContent}</a>`)
                )
              }}/>
  }

  renderStopMarkers() {
    const { count, results, query } = this.props.stop
    if (count < 1)
      return null

    const arrStops = results.map((ele) => ({
      "type": "Feature",
      "properties": {
        "popupContent": `${ele.name}<br />${ele.stop_id}`,
        "stop_id": `${ele.stop_id}`,
        "icon": mintStopIcon,
      },
      "geometry": ele.geojson,
    }))

    const stopCollection = {
      "type": "FeatureCollection",
      "features": arrStops
    }

    return <GeoJSON
      key={`stops-${query}-${count}`}
      data={stopCollection}
      pointToLayer={(feat, latlon) => {
        return (
          L.marker(latlon, {
            icon: feat.properties.icon
          }).bindPopup(`<a href="/#/map/stop/${feat.properties.stop_id}">${feat.properties.popupContent}</a>`)
        )
      }} />
  }

  forceSetMapCenterToCurrent() {
    const { geo } = this.props
    const { leafletElement } = this.refs.map
    const { zoom } = this.refs.map.viewport // another key is 'center'
    const curLoc = [geo.coords.latitude, geo.coords.longitude]
    leafletElement.setView(curLoc, zoom > 13 ? 13 : zoom)
  }

  handleClick(e, data) {
    console.log('tap on menucontext menuitem', e, data)
  }

  render() {
    const { loggedIn, geo } = this.props
    const myLocationMarker = geo.coords ? (
      <CircleMarker
        center={[geo.coords.latitude, geo.coords.longitude]}
        radius={8}
        fillColor={'rgb(33, 150, 243)'}
        fillOpacity={0.9}
        color={'white'}
        stroke
        weight={2}
        opacity={1}
        className='my-location-marker' />
    ) : null
    return (
      <FullPageBox>
        {/* <Nav loggedIn={loggedIn} />
        <FloatPane loggedIn={loggedIn} {...this.props} />*/}
        {geo.coords && <a onClick={this.forceSetMapCenterToCurrent.bind(this)}>
          <FollowMyLocation>
            <i className="far fa-dot-circle"></i>
          </FollowMyLocation>
        </a>}
        <ContextMenu
          top={this.state.top}
          left={this.state.left}
          visible={this.state.visible}
          coords={this.state.coords} />
        <Map
          center={this.state.mapCenter}
          key="map"
          zoom={geo.zoom}
          length={4}
          zoomControl={false}
          animate
          tap={true}
          onContextMenu={(e) => {
            // TODO: handle set as start, set as destination
            this.setState({
              top: e.containerPoint.y,
              left: e.containerPoint.x,
              visible: true,
              coords: [e.latlng.lng, e.latlng.lat],
            })
          }}
          style={{flex: 1}}
          onMovestart={(e) => {
            this.setState({visible: false})
          }}
          onMoveend={(e) => {
            const lc = e.target.getCenter()
            const z = e.target.getZoom()
            store.dispatch(lastCenterUpdate(lc.lat, lc.lng, z))
          }}
          ref='map'>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            // url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            url={MAPBOX_URL}
          />
          <Routing map={this.refs.map} />
          <ZoomControl position="topright" />
          {myLocationMarker}
          <span>
          </span>
        </Map>
      </FullPageBox>
    )
  }
}


const mapStateToProps = state => ({
  loggedIn: loggedIn(state.auth),
  geo: state.geo,
})
export default connect(
  mapStateToProps,
  {}
)(Geo)
