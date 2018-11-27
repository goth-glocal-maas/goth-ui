import React, { Component } from "react"
import ReactMapGL, {
  // LinearInterpolator,
  SVGOverlay,
  CanvasOverlay
} from "react-map-gl"
import { Query } from "react-apollo"
import { fromJS } from "immutable"
import styled from "styled-components"
import axios from "axios"
import polyline from "@mapbox/polyline"
import "mapbox-gl/dist/mapbox-gl.css"
import { scaleOrdinal } from "d3-scale"
import { schemeCategory10 } from "d3-scale-chromatic"
import { rgb } from "d3-color"
import { Subscribe } from "unstated"
import bbox from "@turf/bbox"
import WebMercatorViewport from "viewport-mercator-project"
import geoViewport from "@mapbox/geo-viewport"

import PlanContainer from "../unstated/plan"

import Panel from "../components/Panel"
import MMarker from "../components/map/Marker"
import TapToMap from "../components/map/TapToMap"
import { MODE_GL_STYLES } from "../constants/mode"
import { getGoodTrips } from "../utils/fn"

import alphaify from "../utils/alphaify"
// import StopsOverlay from "../components/map/StopsOverlay"
import { AVAILABLE_STOPS_QUERY } from "../constants/GraphQLCmd"

const FullPageBox = styled.div`
  height: 100vh;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: row;

  @media (max-width: 450px) {
    flex-direction: column-reverse;
  }
`

function round(x, n) {
  const tenN = Math.pow(10, n)
  return Math.round(x * tenN) / tenN
}

const color = scaleOrdinal(schemeCategory10)

export const dataLayer = fromJS({
  id: "data",
  source: "itinerary",
  type: "line",
  paint: {
    "line-width": 6,
    "line-color": "#0080ef"
  }
})

const BASE_STYLE = {
  fill: "none",
  stroke: alphaify(color(6), 0.7),
  strokeWidth: 6,
  strokeDasharray: "5,10,5",
  strokeLinecap: "round"
}

class Map extends Component {
  state = {
    viewport: {
      latitude: 7.8852323,
      longitude: 98.3808517,
      zoom: 13,
      // transitionInterpolator: new LinearInterpolator({
      //   around: [event.offsetCenter.x, event.offsetCenter.y]
      // }),
      transitionDuration: 200,
      tapLocation: []
    },
    defaultMapStyle: null,
    mapStyle: null,
    goodTrips: [],
    visibleTrips: [],
    hash: "",
    picked: -1,
    stopsInView: []
  }

  constructor(props) {
    super(props)
    this._onViewportChange = this._onViewportChange.bind(this)
    this._redrawCanvasOverlay = this._redrawCanvasOverlay.bind(this)
    this._redrawSVGOverlay = this._redrawSVGOverlay.bind(this)
    this._redrawItinerary = this._redrawItinerary.bind(this)
  }

  componentDidMount() {
    // Start getting base MapStyle from our provider
    axios
      .get(process.env.REACT_APP_MAPGL_MAPSTYLE)
      .then(resp => {
        this.setState({ defaultMapStyle: resp.data })
        this._loadData()
      })
      .catch(error => {
        console.error(error)
      })
  }

  componentWillReceiveProps(nextProps) {
    const { hash, picked, itineraries } = nextProps.plan.state
    let newState = {}
    if (hash !== this.state.hash || picked !== this.state.picked) {
      const goodTrips = getGoodTrips(itineraries)
      let visibleTrips =
        picked < 0 ? goodTrips : goodTrips.filter((ele, ind) => ind === picked)
      newState = { hash, picked, goodTrips, visibleTrips }
      if (picked !== -1 && goodTrips.length > 0) {
        const allLegs = goodTrips[0].legs.map((leg, ind) =>
          polyline.decode(leg.legGeometry.points)
        )
        const polygeo = { type: "MultiLineString", coordinates: allLegs }
        const [minLat, minLng, maxLat, maxLng] = bbox(polygeo)
        const currViewport = new WebMercatorViewport(this.state.viewport)
        const bbound = [[minLng, minLat], [maxLng, maxLat]]
        // TODO: this doesn't consider "Panel" at all, so half is behind panel
        const { longitude, latitude, zoom } = currViewport.fitBounds(bbound, {
          padding: 40
        })
        const viewport = {
          ...this.state.viewport,
          longitude,
          latitude,
          zoom
        }
        newState = { ...newState, viewport }
      }
      this.setState(newState)
    }
  }

  _renderLeg(points, index, leg) {
    /* render each leg of our itinerary
    TODO: need to change color or opacity for unpicked leg
    // onClick={() => windowAlert(`route ${index}`)}
    */
    let style = {
      ...BASE_STYLE,
      ...(MODE_GL_STYLES[leg.mode] || {})
    }

    if (leg.routeColor) {
      style.stroke = `#${leg.routeColor}`
    }
    return (
      <g style={{ pointerEvents: "click", cursor: "pointer" }}>
        <g style={{ pointerEvents: "visibleStroke" }}>
          <path style={style} d={`M${points.join("L")}`} />
        </g>
      </g>
    )
  }

  _redrawItinerary(project, itinerary, index) {
    // loop through every leg of this itinerary
    const { legs } = itinerary
    return (
      <g key={`iti::${index}`}>
        {legs.map((leg, legIndex) => {
          const coordinates = polyline.toGeoJSON(leg.legGeometry.points)
            .coordinates
          const points = coordinates
            .map(project)
            .map(p => [round(p[0], 1), round(p[1], 1)])
          return (
            <g key={`iti-leg-${index}${legIndex}`}>
              {this._renderLeg(points, legIndex, leg)}
            </g>
          )
        })}
      </g>
    )
  }

  _redrawSVGOverlay({ project }) {
    // Take all itineraries and start drawing leg
    const { visibleTrips } = this.state
    return (
      <g>
        {visibleTrips.map((itinerary, index) =>
          this._redrawItinerary(project, itinerary, index)
        )}
      </g>
    )
  }

  _redrawDot(ctx, p, i, thisColor) {
    const point = [round(p[0], 1), round(p[1], 1)]
    ctx.fillStyle = rgb(thisColor)
      .brighter(1)
      .toString()
    ctx.beginPath()
    ctx.arc(point[0], point[1], 6, 0, Math.PI * 2)
    ctx.fill()
  }

  _redrawCanvasOverlay({ ctx, width, height, project }) {
    const { visibleTrips } = this.state

    ctx.clearRect(0, 0, width, height)
    visibleTrips.map((itinerary, _) => {
      itinerary.legs.map((leg, index) => {
        // draw start & end of every legs
        const se = [[leg.from.lon, leg.from.lat], [leg.to.lon, leg.to.lat]]
        const routeColor = leg.routeColor ? `#${leg.routeColor}` : color(6)
        return se
          .map(project)
          .forEach((p, i) => this._redrawDot(ctx, p, i, routeColor))
      })
    })
  }

  _loadData = data => {
    let _mapStyle = fromJS(this.state.defaultMapStyle)
    if (!data) {
      this.setState({ mapStyle: _mapStyle })
      return
    }
  }

  _onViewportChange = viewport => this.setState({ viewport })

  _onClick = ({ lngLat }) => {
    this.setState({ tapLocation: lngLat })
    setTimeout(() => this.setState({ tapLocation: [] }), 3000)
  }

  _onTapToMapCloseClick() {
    this.setState({ tapLocation: [] })
  }

  render() {
    const { mapStyle, tapLocation, viewport } = this.state
    const { plan } = this.props

    const { latitude, longitude, zoom, width, height } = viewport
    const skipStopQuery =
      width === undefined || height === undefined || zoom < 14
    console.log("skipStopQuery", skipStopQuery, width, height, zoom)
    const [minLon, minLat, maxLon, maxLat] = geoViewport.bounds(
      [longitude, latitude],
      zoom,
      [width, height]
    )
    const stopsQuery = {
      minLat,
      minLon,
      maxLat,
      maxLon
    }

    return (
      <FullPageBox>
        <Panel {...this.props} />
        {mapStyle && (
          <ReactMapGL
            {...this.state.viewport}
            onViewportChange={this._onViewportChange}
            mapStyle={this.state.mapStyle}
            reuseMaps={true}
            width="100%"
            height="100%"
            onClick={this._onClick}
          >
            <Query
              query={AVAILABLE_STOPS_QUERY}
              variables={stopsQuery}
              skip={skipStopQuery}
            >
              {({ loading, error, data }) => {
                console.log('stop query : ', stopsQuery, loading, error, data)
                if (loading || error) return <React.Fragment />
                if (data && data.stops.length === 0) return <React.Fragment />
                console.log('stop : ', data, viewport)
                return <React.Fragment />
              }}
            </Query>
            <SVGOverlay redraw={this._redrawSVGOverlay} />
            <CanvasOverlay redraw={this._redrawCanvasOverlay} />
            {plan.state.from.length === 2 && (
              <MMarker
                mode="START"
                color={color(8)}
                draggable
                lat={plan.state.from[0]}
                lon={plan.state.from[1]}
                // onDragStart={this._onMarkerDragStart}
                // onDrag={this._onMarkerDrag}
                onDragEnd={evt => {
                  plan.setFrom([evt.lngLat[1], evt.lngLat[0]])
                }}
              />
            )}
            {plan.state.to.length === 2 && (
              <MMarker
                mode="END"
                color={color(8)}
                draggable
                lat={plan.state.to[0]}
                lon={plan.state.to[1]}
                onDragEnd={evt => {
                  plan.setTo([evt.lngLat[1], evt.lngLat[0]])
                }}
              />
            )}
            <TapToMap
              lat={tapLocation && tapLocation[1]}
              lon={tapLocation && tapLocation[0]}
              onSetFrom={v => plan.setFrom(v)}
              onSetTo={v => plan.setTo(v)}
              onCloseClick={this._onTapToMapCloseClick.bind(this)}
            />
          </ReactMapGL>
        )}
      </FullPageBox>
    )
  }
}

export default props => {
  return (
    <Subscribe to={[PlanContainer]}>
      {plan => <Map {...props} plan={plan} />}
    </Subscribe>
  )
}
