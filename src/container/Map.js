import React, { Component } from "react"
import ReactMapGL from "react-map-gl"
import { fromJS } from "immutable"
import styled from "styled-components"

import Panel from "../components/Panel"
import MMarker from "../components/map/Marker"
import "mapbox-gl/dist/mapbox-gl.css"

const mapStyle = fromJS({
  style:
    "https://maps.tilehosting.com/styles/streets/style.json?key=W6SN2LHoDrAWj62wOyV0"
})

const FullPageBox = styled.div`
  height: 100vh;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
`

class Map extends Component {
  state = {
    viewport: {
      width: "100vw",
      height: "100vh",
      latitude: 7.8852323,
      longitude: 98.3808517,
      zoom: 13
    }
  }

  _onViewportChange = viewport => this.setState({ viewport })

  render() {
    return (
      <FullPageBox>
        <Panel />

        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={this._onViewportChange}
          mapStyle={process.env.REACT_APP_MAPGL_MAPSTYLE}
          reuseMaps={true}
        >
          <MMarker mode="BUS" />
        </ReactMapGL>
      </FullPageBox>
    )
  }
}

export default Map
