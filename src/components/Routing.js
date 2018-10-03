import React, { Component } from 'react'
import PropTypes from 'prop-types'
import L from 'leaflet'
import { Popup } from 'react-leaflet'
import 'leaflet-routing-machine'
import 'leaflet-control-geocoder'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

import { MAPBOX_TOKEN, MAPBOX_SERVICE_URL } from '../constants/Api'

class Routing extends Component {
  static propTypes = {
    map: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      routingPopUp: null,
    }
    this.initializeRouting = this.initializeRouting.bind(this)
    this.destroyRouting = this.destroyRouting.bind(this)
    this.createPopupsHandler = this.createPopupsHandler.bind(this)
    this.setRoutingPopUp = this.setRoutingPopUp.bind(this)
  }

  componentDidUpdate() {
    this.initializeRouting()
  }

  componentWillUnmount() {
    this.destroyRouting()
  }

  initializeRouting() {
    if (this.props.map && !this.routing) {
      const plan = new L.Routing.Plan([
        L.latLng(13.8470595, 100.536382),
        L.latLng(13.8372048, 100.547389)
      ], {
        routeWhileDragging: false,
        geocoder: L.Control.Geocoder.nominatim(),
      })

      this.routing = L.Routing.control({
        plan,
        // serviceUrl: MAPBOX_SERVICE_URL,
        // router: L.Routing.mapbox(MAPBOX_TOKEN),
      })

      this.props.map.leafletElement.addControl(this.routing)
      // L.DomEvent.on(this.props.map.leafletElement, 'click', this.createPopupsHandler)
    }
  }

  destroyRouting() {
    if (this.props.map) {
      this.props.map.leafletElement.removeControl(this.routing)
      // L.DomEvent.off(this.props.map.leafletElement, 'click', this.createPopupsHandler)
    }
  }

  createPopupsHandler(e) {
    console.log('here?', e)
    const position = e.latlng
    const startBtnOnClick = () => {
      this.routing.spliceWaypoints(0, 1, position)
      this.setRoutingPopUp(null)
    }
    const endBtnOnClick = () => {
      this.routing.spliceWaypoints(this.routing.getWaypoints().length - 1, 1, position)
      this.setRoutingPopUp(null)
    }
    const startBtn = <button onClick={startBtnOnClick}>Set begin position</button>
    const endBtn = <button onClick={endBtnOnClick}>Set end position</button>
    const children = (<div>
      {startBtn}
      {endBtn}
    </div>)
    const onClose = this.setRoutingPopUp
    this.setRoutingPopUp({ children, position, onClose })
  }

  setRoutingPopUp(routingPopUp) {
    this.setState({ routingPopUp })
  }

  render() {
    console.log(this.props)
    const { routingPopUp } = this.state
    if (routingPopUp) return <Popup {...this.state.routingPopUp} />

    return null
  }
}

export default Routing
