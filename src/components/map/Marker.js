import React, { Component } from 'react'
import { Marker } from 'react-map-gl';
import Pin from './Pin'

export default class MMarker extends Component {
  render() {
    return (
      <Marker latitude={7.8852323} longitude={98.3808517}
        offsetLeft={-20} offsetTop={-10}>
        <Pin>You are here</Pin>
      </Marker>
    )
  }
}
