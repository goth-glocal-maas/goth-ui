import React, { Component } from "react"
import { Popup } from "react-map-gl"

export default class MMarker extends Component {
  render() {
    const { lat = 7.8723, lon = 98.3717 } = this.props

    return (
      <Popup
        latitude={lat}
        longitude={lon}
        closeButton={true}
        closeOnClick={false}
        anchor="bottom"
      >
        <div>You are here</div>
      </Popup>
    )
  }
}

// ref: https://uber.github.io/react-map-gl/#/Documentation/api-reference/popup?section=properties
