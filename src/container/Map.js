import React, { Component } from "react"
import ReactMapGL from "react-map-gl"
import { fromJS } from "immutable"
import styled from "styled-components"
import axios from "axios"

import Panel from "../components/Panel"
import MMarker from "../components/map/Marker"
import Popup from "../components/map/Popup"
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
    },
    defaultMapStyle: null,
    mapStyle: null,
  }

  componentDidMount() {
    axios
      .get(process.env.REACT_APP_MAPGL_MAPSTYLE)
      .then(resp => {
        this.setState({ mapStyle: resp.data })
        this._loadData()
      })
      .catch(error => {
        console.error(error)
      })
    /*     requestJson('data/us-income.geojson', (error, response) => {
      if (!error) {
        this._loadData(response);
      }
    }); */
  }

  _loadData = data => {
    let initMapStyle = this.state.defaultMapStyle
    if (!data) {
      this.setState({})
    }

    // updatePercentiles(data, f => f.properties.income[this.state.year]);

    // const mapStyle = defaultMapStyle
    //   // Add geojson source to map
    //   .setIn(['sources', 'incomeByState'], fromJS({type: 'geojson', data}))
    //   // Add point layer to map
    //   .set('layers', defaultMapStyle.get('layers').push(dataLayer));

    // this.setState({data, mapStyle});
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
          >
            <MMarker mode="BUS" />
            <Popup />
          </ReactMapGL>
        )}
      </FullPageBox>
    )
  }
}

export default Map
