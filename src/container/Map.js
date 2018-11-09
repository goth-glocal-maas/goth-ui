import React, { Component } from 'react';
import ReactMapGL from 'react-map-gl';
import styled from "styled-components"

import Panel from '../components/Panel'

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

  render() {
    return (
      <FullPageBox>
        <Panel>

        </Panel>
        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={(viewport) => this.setState({ viewport })}
        />
      </FullPageBox>
    );
  }
}

export default Map;