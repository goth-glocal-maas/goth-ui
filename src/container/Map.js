import React, { Component } from "react"
import ReactMapGL, {
  LinearInterpolator,
  SVGOverlay,
  CanvasOverlay
} from "react-map-gl"
import { fromJS } from "immutable"
import styled from "styled-components"
import axios from "axios"
import polyline from "@mapbox/polyline"
import "mapbox-gl/dist/mapbox-gl.css"
import { scaleOrdinal } from "d3-scale"
import { schemeCategory10 } from "d3-scale-chromatic"
import { rgb } from "d3-color"
import { Subscribe } from "unstated"

import PlanContainer from "../unstated/plan"

import Panel from "../components/Panel"
import MMarker from "../components/map/Marker"
import Popup from "../components/map/Popup"
import { MODE_GL_STYLES } from "../constants/mode"

import alphaify from "../utils/alphaify"
import ROUTES from "../test/rt_result.json"

const FullPageBox = styled.div`
  height: 100vh;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
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
  strokeLinecap: "round",
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
    mapStyle: null
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
      <g>
        {legs.map((leg, legIndex) => {
          const coordinates = polyline.toGeoJSON(leg.legGeometry.points)
            .coordinates
          const points = coordinates
            .map(project)
            .map(p => [round(p[0], 1), round(p[1], 1)])
          return (
            <g key={legIndex}>{this._renderLeg(points, legIndex, leg)}</g>
          )
        })}
      </g>
    )
  }

  _redrawSVGOverlay({ project }) {
    // Take all itineraries and start drawing leg
    // TODO: change this to this.state
    const { itineraries } = ROUTES.data.route_plan
    return (
      <g>
        {itineraries.map((itinerary, index) =>
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
    // TODO: change this to this.state
    const { itineraries } = ROUTES.data.route_plan
    ctx.clearRect(0, 0, width, height)
    itineraries.map((itinerary, _) => {
      itinerary.legs.map((leg, index) => {
        // draw start & end of every legs
        const se = [[leg.from.lon, leg.from.lat], [leg.to.lon, leg.to.lat],]
        const routeColor = (leg.routeColor) ? `#${leg.routeColor}` : color(6)
        se.map(project).forEach((p, i) => this._redrawDot(ctx, p, i, routeColor))
      })
    })
  }

  _loadData = data => {
    let _mapStyle = fromJS(this.state.defaultMapStyle)
    console.log("_loadData:", data, _mapStyle)
    if (!data) {
      this.setState({ mapStyle: _mapStyle })
      return
    }
  }

  _onViewportChange = viewport => this.setState({ viewport })

  render() {
    const { mapStyle } = this.state
    const { itineraries } = ROUTES.data.route_plan
    const { legs } = itineraries[0]
    const coords = [
      [legs[0].from.lon, legs[0].from.lat],
      [legs[3].to.lon, legs[3].to.lat],
    ]

    return (
      <Subscribe to={[PlanContainer]}>
        {plan => (
          <FullPageBox>
            <Panel />
            {mapStyle && (
              <ReactMapGL
                {...this.state.viewport}
                onViewportChange={this._onViewportChange}
                mapStyle={this.state.mapStyle}
                reuseMaps={true}
                width="100%"
                height="100%"
              >
                <SVGOverlay redraw={this._redrawSVGOverlay} />
                <CanvasOverlay redraw={this._redrawCanvasOverlay} />
                {plan.state.from && <MMarker mode="BICYCLE" color={color(7)} lon={plan.state.from[0]} lat={plan.state.from[1]} />}
                {plan.state.to && <MMarker mode="BICYCLE" color={color(8)} lon={plan.state.to[0]} lat={plan.state.to[1]} />}
                {Object.keys(coords)
                  .map(index => <MMarker
                    key={`coords-${index}`} mode="TAXI"
                    color={color(index)}
                    lon={coords[index][0]} lat={coords[index][1]} />)}
                <Popup />
              </ReactMapGL>
            )}
          </FullPageBox>
        )}
      </Subscribe>
    )
  }
}

export default Map
