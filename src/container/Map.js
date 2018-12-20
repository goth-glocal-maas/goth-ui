import React, { Component, Fragment } from "react"
import ReactMapGL, {
  // LinearInterpolator,
  SVGOverlay,
  CanvasOverlay,
  Popup
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
import Modal from "../components/Modal"
import StopSign from "../components/StopSign"
import MMarker from "../components/map/Marker"
import StopMarker from "../components/map/StopMarker"
import { MODE_GL_STYLES } from "../constants/mode"
import { getGoodTrips } from "../utils/fn"
import { gray } from "../constants/color"

import alphaify from "../utils/alphaify"
import { AVAILABLE_STOPS_QUERY } from "../constants/GraphQLCmd"

const FullPageBox = styled.div`
  height: 100%;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: row;

  @media (max-width: 450px) {
    flex-direction: column-reverse;
  }
`

const MapContainer = styled.div`
  width: 100%;
  height: 100%;

  @media (max-width: 450px) {
    height: 40vh;
    min-height: 200px;
  }
`

const StyledUL = styled.ul`
  display: flex;
  flex-direction: row;
  font-size: 1.3rem;

  li {
    display: block;
    width: 10rem;
  }

  li a {
    width: 100%;
  }
`

const PopupCloseButton = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1.2rem;
  width: 1.8rem;
  height: 1.8rem;
  cursor: pointer;
  text-align: center;
  vertical-align: middle;

  :hover {
    background: ${gray};
    color: white;
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
      transitionDuration: 200
    },
    defaultMapStyle: null,
    mapStyle: null,
    goodTrips: [],
    visibleTrips: [],
    hash: "",
    picked: -1,
    stopsInView: [],
    popupInfo: null
  }

  constructor(props) {
    super(props)
    this._onViewportChange = this._onViewportChange.bind(this)
    this._redrawCanvasOverlay = this._redrawCanvasOverlay.bind(this)
    this._redrawSVGOverlay = this._redrawSVGOverlay.bind(this)
    this._redrawItinerary = this._redrawItinerary.bind(this)
    this._renderPopup = this._renderPopup.bind(this)
  }

  componentDidMount() {
    // Start getting base MapStyle from our provider
    axios
      .get(process.env.REACT_APP_MAPGL_MAPSTYLE)
      .then(resp => {
        this.setState({ defaultMapStyle: resp.data })
        this._loadData()
      })
      .catch(error => {})
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
      return null
    })
  }

  _loadData = data => {
    let _mapStyle = fromJS(this.state.defaultMapStyle)
    if (!data) {
      this.setState({ mapStyle: _mapStyle })
      return
    }
  }

  _handlePopupClose() {
    this.setState({ popupInfo: null })
  }

  _renderPopup() {
    const { plan } = this.props
    const { popupInfo } = this.state
    return (
      popupInfo && (
        <Popup
          tipSize={5}
          anchor="bottom"
          longitude={popupInfo.lon}
          latitude={popupInfo.lat}
          offsetTop={popupInfo.id ? -10 : 0}
          closeOnClick={false}
          closeButton={false}
        >
          <PopupCloseButton onClick={this._handlePopupClose.bind(this)}>
            X
          </PopupCloseButton>
          {popupInfo.id && <StopSign stopId={popupInfo.id} />}
          <StyledUL>
            <li
              onClick={() => {
                this.setState({ popupInfo: null })
                plan.setFrom([popupInfo.lat, popupInfo.lon])
              }}
            >
              <a>From here</a>
            </li>
            <li
              onClick={() => {
                this.setState({ popupInfo: null })
                plan.setTo([popupInfo.lat, popupInfo.lon])
              }}
            >
              <a>To here</a>
            </li>
          </StyledUL>
        </Popup>
      )
    )
  }

  _onViewportChange = viewport => this.setState({ viewport })

  _onClick = ({ lngLat }) => {
    this.setState({
      popupInfo: { lat: lngLat[1], lon: lngLat[0] }
    })
  }

  render() {
    const { mapStyle, viewport } = this.state
    const { plan } = this.props

    const { latitude, longitude, zoom, width, height } = viewport
    const skipStopQuery =
      width === undefined || height === undefined || zoom < 13.5
    // console.log("skipStopQuery", skipStopQuery, width, height, zoom)
    const [minLon, minLat, maxLon, maxLat] = geoViewport.bounds(
      [longitude, latitude],
      zoom,
      [width, height]
    )
    const stopsQuery = {
      minLat: +minLat.toFixed(6),
      minLon: +minLon.toFixed(6),
      maxLat: +maxLat.toFixed(6),
      maxLon: +maxLon.toFixed(6)
    }

    return (
      <FullPageBox>
        <Panel {...this.props} />
        {mapStyle && (
          <MapContainer>
            <ReactMapGL
              {...this.state.viewport}
              onViewportChange={this._onViewportChange}
              mapStyle={this.state.mapStyle}
              reuseMaps={true}
              width="100%"
              height="100%"
              onClick={this._onClick}
            >
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
              <Query
                query={AVAILABLE_STOPS_QUERY}
                variables={stopsQuery}
                skip={skipStopQuery}
              >
                {({ loading, error, data }) => {
                  if (!data || !data.stops || data.stops.length === 0)
                    return <Fragment />
                  return (
                    <Fragment>
                      {data.stops.map(ele => (
                        <StopMarker
                          key={`stop-marker-${ele.id}`}
                          {...ele}
                          onClick={() =>
                            this.setState({
                              popupInfo: ele
                            })
                          }
                        />
                      ))}
                    </Fragment>
                  )
                }}
              </Query>
              {this._renderPopup()}
            </ReactMapGL>
          </MapContainer>
        )}
        <Modal />
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
