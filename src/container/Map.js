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

  _renderRoute(points, index, leg) {
    // onClick={() => windowAlert(`route ${index}`)}
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
            <g key={legIndex}>{this._renderRoute(points, legIndex, leg)}</g>
          )
        })}
      </g>
    )
  }

  _redrawSVGOverlay({ project }) {
    const { itineraries } = ROUTES.data.route_plan
    return (
      <g>
        {itineraries.map((itinerary, index) =>
          this._redrawItinerary(project, itinerary, index)
        )}
      </g>
    )
  }

  _redrawCanvasOverlay({ ctx, width, height, project }) {
    ctx.clearRect(0, 0, width, height)
    const dd =
      "qdkwQwgeo@\\BpA~OyDbKgEdKkFgKX{KxDms@Z}SeW{EwAYuAHqDg@kEDkDc@wD?iECkDfAp@~J@fHyApD_HtAsF|AkKlKqDjHiLxYY`MeW}Ai@tH`K|BpYrFzDf@b`@zCtUfCwe@vMcD`DwMEq@dF}BhHuE~DoJiJOiETk@]c@OsAqP^eY~@MmCaA?aBt@wCP?tBfSu@dArO?~CqCbK{BnIs@|`@w@zFyJ|E}EhDkDlHiI~GjF~@vDiBlEv@`MeFj@fA~EwBdAsAxGcRkEC"
    const COORDS = polyline.decode(dd)
    COORDS.map(project).forEach((p, i) => {
      const point = [round(p[0], 1), round(p[1], 1)]
      ctx.fillStyle = rgb(color(6))
        .brighter(1)
        .toString()
      ctx.beginPath()
      ctx.arc(point[0], point[1], 4, 0, Math.PI * 2)
      ctx.fill()
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
    return (
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
            <MMarker mode="BUS" />
            <Popup />
          </ReactMapGL>
        )}
      </FullPageBox>
    )
  }
}

export default Map
