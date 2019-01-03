import React, { Component, Fragment } from "react"
import { Marker } from "react-map-gl"

export default class MyLocationMarker extends Component {
  render() {
    const {
      size = 20,
      lat,
      lon,
      draggable = false,
      onDragEnd
    } = this.props
    if (!lat || !lon) {
      return <Fragment />
    }
    return (
      <Marker
        latitude={+lat}
        longitude={+lon}
        offsetLeft={0}
        offsetTop={0}
        draggable={draggable}
        onDragEnd={onDragEnd}
      >
        <svg
          height={size}
          viewBox="0 0 24 24"
        >
          <g transform="matrix(0.954476,0,0,0.954476,0.604163,0.767116)">
            <path
              d="M11.972,0.68C18.263,0.68 23.352,5.482 23.352,11.773C23.352,18.065 18.244,22.871 11.953,22.871C5.662,22.871 0.554,18.065 0.554,11.773C0.554,5.482 5.681,0.68 11.972,0.68Z"
              style={{fill: '#1249FFEA', stroke: '#FFFFFFFF', strokeWidth: '4px'}}
            />
          </g>
        </svg>
      </Marker>
    )
  }
}
