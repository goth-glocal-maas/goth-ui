import React, { Component } from 'react'
import { Marker } from 'react-map-gl'
import Pin from './Pin'
import { red } from "../../constants/color"

export default class MMarker extends Component {
  render() {
    const { size = 30, mode = 'WALK', lat = 7.8852323, lon = 98.3808517, color } = this.props;
    const ccolor = color ? color : red
    return (
      <Marker latitude={+lat} longitude={+lon}
        offsetLeft={0} offsetTop={0}>
        <Pin mode={mode} size={size} color={ccolor}>You are here</Pin>
      </Marker>
    )
  }
}
