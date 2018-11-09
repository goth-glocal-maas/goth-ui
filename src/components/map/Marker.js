import React, { Component } from 'react'
import { Marker } from 'react-map-gl'
import Pin from './Pin'

export default class MMarker extends Component {
  render() {
    const { size = 30, mode = 'WALK', lat = 7.8852323, lon = 98.3808517 } = this.props;

    return (
      <Marker latitude={lat} longitude={lon}
        offsetLeft={-20} offsetTop={-10}>
        <Pin mode={mode} size={size}>You are here</Pin>
      </Marker>
    )
  }
}
