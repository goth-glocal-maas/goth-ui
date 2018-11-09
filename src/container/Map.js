import React, { Component } from 'react';
import ReactMapGL from 'react-map-gl';
import { fromJS } from 'immutable';
import styled from "styled-components"

import Panel from '../components/Panel'
import MMarker from '../components/map/Marker'
import Marker from '../components/map/Marker';



const mapStyle = fromJS({
  version: 8,
  sources: {
    points: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          { type: 'Feature', geometry: { type: 'Point', coordinates: [7.8852323, 98.3808517] } }
        ]
      }
    }
  },
  layers: [
    {
      id: 'my-layer',
      type: 'circle',
      source: 'points',
      paint: {
        'circle-color': '#f00',
        'circle-radius': '4'
      }
    }
  ]
});


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
      width: '100vw',
      height: '100vh',
      latitude: 7.8852323,
      longitude: 98.3808517,
      zoom: 13
    }
  };

  _onViewportChange = viewport => this.setState({viewport});

  render() {
    return (
      <FullPageBox>
        <Panel>

        </Panel>
        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={this._onViewportChange}
        >
          <MMarker />
        </ReactMapGL>
      </FullPageBox>
    );
  }
}

export default Map;