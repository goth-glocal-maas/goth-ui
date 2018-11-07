import React, { Component, Fragment } from "react"
import styled from "styled-components"
import _ from "lodash"
import {
  Map,
  TileLayer,
  CircleMarker,
  ZoomControl,
  ScaleControl,
  FeatureGroup,
  GeoJSON,
  Marker
} from "react-leaflet"
// import { EditControl } from 'react-leaflet-draw'
import * as L from "leaflet"
import gql from "graphql-tag"
import { Route, Switch } from "react-router-dom"
import { graphql, compose, Query } from "react-apollo"

// import FloatPane from '../components/FloatPane'
import ODInput from "../components/ODInput"
// import store from "../store"

import ContextMenu from "../components/map/ContextMenu"
import { MAPBOX_URL } from "../constants/Api"
import ItineraryPicker from "../components/ItineraryPicker"
import ItineraryPlan from "../components/ItineraryPlan"
import PlanPolygonOverlay from "../components/map/PlanPolygonOverlay"

const FullPageBox = styled.div`
  height: 100%;
  min-height: 100vh;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
`

const FollowMyLocation = styled.div`
  width: 40px;
  height: 40px;
  background: #fefefebb;
  border-radius: 10px;
  color: #209cee;
  position: fixed;
  text-align: center;
  padding-top: 10px;
  right: 0;
  bottom: 150px;
  z-index: 21;
  background: #ffffffaa;
`

const OD = styled.div`
  background: transparent;
  z-index: 21;
  position: fixed;
  top: 0;
  width: 100%;
`

const stopIcon = L.divIcon({
  className: "divIcon",
  html:
    '<div><img src="//static.traffy.xyz/icon/bus-stop-48.png" width="24" height="24"></div>',
  popupAnchor: [2, -22],
  iconAnchor: [12, 23]
})

const mintStopIcon = L.icon({
  iconUrl: "//static.10ninox.com/map/mint-marker-icon.png",
  iconRetinaUrl: "//static.10ninox.com/map/mint-marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 40],
  popupAnchor: [2, -22]
})

const dragableIcon = L.icon({
  iconUrl: "//static.10ninox.com/map/pink-marker-icon.png",
  iconRetinaUrl: "//static.10ninox.com/map/pink-marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 40],
  popupAnchor: [2, -22]
})

const allDestinationInfo = gql`
  query allDestinationInfo {
    destinationInfo @client {
      origin
      originLabel
      destination
      destinationLabel
    }
  }
`

class Geo extends Component {
  state = {
    top: 0,
    left: 0,
    visible: false,
    itineraryPickerVisible: false,
    coords: [],
    mapCenter: [7.8852323, 98.3808517],
    position: {}
  }

  constructor() {
    super()
    this.handleContextMenuVisibility = this.handleContextMenuVisibility.bind(
      this
    )
    this.handleItineraryPickerClose = this.handleItineraryPickerClose.bind(this)
  }

  componentWillMount() {
    // this.setState({ mapCenter: this.props.geo.mapCenter })
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
    // navigator.geolocation.getCurrentPosition(
    //   position => store.dispatch(geoLocationUpdate(position)),
    //   error => store.dispatch(geoLocationFailed(error)),
    //   { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
    // )
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        this.setState({ position })
      },
      error => {
        console.error("err: ", error)
      } //store.dispatch(geoLocationFailed(error))
    )
  }

  componentWillReceiveProps(newProps) {
    // const omCenter = this.props.geo.mapCenter
    // const newCenter = newProps.geo.mapCenter
    // let center = {
    //   lastCenter: newProps.geo.lastCenter
    // }
    // if (omCenter[0] !== newCenter[0] || omCenter[1] !== newCenter[1]) {
    //   center.mapCenter = newCenter
    // }
    // this.setState({ ...center })
  }

  forceSetMapCenterToCurrent() {
    const { geo } = this.props
    const { leafletElement } = this.refs.map
    const { zoom } = this.refs.map.viewport // another key is 'center'
    const curLoc = [geo.coords.latitude, geo.coords.longitude]
    leafletElement.setView(curLoc, zoom > 13 ? 13 : zoom)
  }

  handleClick(e, data) {
    console.log("tap on menucontext menuitem", e, data)
  }

  handleContextMenuVisibility(visible) {
    console.log("context menu", this.props)
    const _v = visible || !this.state.visible
    this.setState({ visible: _v })
  }

  handleItineraryPickerClose() {
    this.setState({ itineraryPickerVisible: false })
  }

  render() {
    const { itineraryPickerVisible } = this.state
    // const { loggedIn, geo } = this.props
    const { destinationInfo } = this.props.allDestinationInfo
    const { destination, origin } = destinationInfo
    // const myLocationMarker = geo.coords ? (
    //   <CircleMarker
    //     center={[geo.coords.latitude, geo.coords.longitude]}
    //     radius={8}
    //     fillColor={"rgb(33, 150, 243)"}
    //     fillOpacity={0.9}
    //     color={"white"}
    //     stroke
    //     weight={2}
    //     opacity={1}
    //     className="my-location-marker"
    //   />
    // ) : null

    return (
      <FullPageBox>
        {/* <Nav loggedIn={loggedIn} />
        <FloatPane loggedIn={loggedIn} {...this.props} />*/}
        {/* {geo.coords && (
          <a onClick={this.forceSetMapCenterToCurrent.bind(this)}>
            <FollowMyLocation>
              <i className="far fa-dot-circle" />
            </FollowMyLocation>
          </a>
        )} */}
        <Switch>
          <Route
            path={`/p/:from/:to`}
            render={props => <ItineraryPicker {...props} />}
          />
          <Route
            path="/"
            render={props => (
              <OD>
                <ODInput {...destinationInfo} />
              </OD>
            )}
          />
        </Switch>
        <ContextMenu
          top={this.state.top}
          left={this.state.left}
          visible={this.state.visible}
          coords={this.state.coords}
          changeVisibility={this.handleContextMenuVisibility}
        />
        <Map
          center={this.state.mapCenter}
          key="map"
          zoom={13}
          length={4}
          zoomControl={false}
          animate
          tap={true}
          onContextMenu={e => {
            if (this.props.location.pathname === "/") {
              this.setState({
                top: e.containerPoint.y,
                left: e.containerPoint.x,
                visible: true,
                coords: [e.latlng.lng, e.latlng.lat]
              })
            }
          }}
          style={{ flex: 1 }}
          onMovestart={e => {
            // this.setState({visible: false})
          }}
          onMoveend={e => {
            // const lc = e.target.getCenter()
            // const z = e.target.getZoom()
            // store.dispatch(lastCenterUpdate(lc.lat, lc.lng, z))
          }}
          ref="map"
        >
          <PlanPolygonOverlay />
          <span style={{ zIndex: 15 }}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
              // url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
              url={MAPBOX_URL}
            />
            <ScaleControl
              maxWidth={200}
              position="bottomright"
              metric={true}
              imperial={false}
            />
          </span>
          {/* <ZoomControl position="topright" /> */}
          {/* {myLocationMarker} */}
        </Map>
      </FullPageBox>
    )
  }
}

const gqGeo = compose(
  graphql(allDestinationInfo, { name: "allDestinationInfo" })
)(Geo)

export default gqGeo
