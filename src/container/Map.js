import React, { Component } from "react"
import ReactMapGL, { LinearInterpolator, SVGOverlay, CanvasOverlay } from "react-map-gl"
import { fromJS } from "immutable"
import styled from "styled-components"
import axios from "axios"
import polyline from "@mapbox/polyline"
import "mapbox-gl/dist/mapbox-gl.css"
import { scaleOrdinal } from 'd3-scale'
import { schemeCategory10 } from 'd3-scale-chromatic'
import { rgb } from 'd3-color'

import Panel from "../components/Panel"
import MMarker from "../components/map/Marker"
import Popup from "../components/map/Popup"
import alphaify from '../utils/alphaify'

const FullPageBox = styled.div`
  height: 100vh;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
`

function round(x, n) {
  const tenN = Math.pow(10, n);
  return Math.round(x * tenN) / tenN;
}

const color = scaleOrdinal(schemeCategory10);

export const dataLayer = fromJS({
  id: 'data',
  source: 'itinerary',
  type: 'line',
  paint: {
    'line-width': 6,
    'line-color': '#0080ef'
  }
});

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
    },
    defaultMapStyle: null,
    mapStyle: null,
  }

  constructor(props) {
    super(props)
    this._onViewportChange = this._onViewportChange.bind(this);
    this._redrawCanvasOverlay = this._redrawCanvasOverlay.bind(this);
    this._redrawSVGOverlay = this._redrawSVGOverlay.bind(this);
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

  _renderRoute(points, index) {
    // onClick={() => windowAlert(`route ${index}`)}
    return (
      <g style={{ pointerEvents: 'click', cursor: 'pointer' }}>
        <g
          style={{ pointerEvents: 'visibleStroke' }}
        >
          <path
            style={{
              fill: 'none',
              stroke: alphaify(color(index), 0.7),
              strokeWidth: 6
            }}
            d={`M${points.join('L')}`} />
        </g>
      </g>
    );
  }

  _redrawSVGOverlay({ project }) {
    const dd = "qdkwQwgeo@\\BpA~OyDbKgEdKkFgKX{KxDms@Z}SeW{EwAYuAHqDg@kEDkDc@wD?iECkDfAp@~J@fHyApD_HtAsF|AkKlKqDjHiLxYY`MeW}Ai@tH`K|BpYrFzDf@b`@zCtUfCwe@vMcD`DwMEq@dF}BhHuE~DoJiJOiETk@]c@OsAqP^eY~@MmCaA?aBt@wCP?tBfSu@dArO?~CqCbK{BnIs@|`@w@zFyJ|E}EhDkDlHiI~GjF~@vDiBlEv@`MeFj@fA~EwBdAsAxGcRkEC"
    const COORDS = polyline.decode(dd)
    const points = COORDS.map(project).map(
      p => [round(p[0], 1), round(p[1], 1)]
    )
    return (
      <g>
        <g key={1}>{this._renderRoute(points, 1)}</g>
      </g>
    );
  }


  _redrawCanvasOverlay({ ctx, width, height, project }) {
    ctx.clearRect(0, 0, width, height);
    const dd = "qdkwQwgeo@\\BpA~OyDbKgEdKkFgKX{KxDms@Z}SeW{EwAYuAHqDg@kEDkDc@wD?iECkDfAp@~J@fHyApD_HtAsF|AkKlKqDjHiLxYY`MeW}Ai@tH`K|BpYrFzDf@b`@zCtUfCwe@vMcD`DwMEq@dF}BhHuE~DoJiJOiETk@]c@OsAqP^eY~@MmCaA?aBt@wCP?tBfSu@dArO?~CqCbK{BnIs@|`@w@zFyJ|E}EhDkDlHiI~GjF~@vDiBlEv@`MeFj@fA~EwBdAsAxGcRkEC"
    const COORDS = polyline.decode(dd)
    COORDS.map(project).forEach((p, i) => {
      const point = [round(p[0], 1), round(p[1], 1)];
      ctx.fillStyle = rgb(color(6)).brighter(1).toString();
      ctx.beginPath();
      ctx.arc(point[0], point[1], 4, 0, Math.PI * 2);
      ctx.fill();
    })
  }

  _loadData = data => {
    let _mapStyle = fromJS(this.state.defaultMapStyle)
    console.log('_loadData:', data, _mapStyle)
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
