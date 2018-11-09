import React, { PureComponent } from "react"
import { blue } from "../../constants/color"
import { MODE_MARKERS } from "../../constants/mode"

const pinStyle = {
  fill: blue,
  stroke: "none",
  fillRule: "evenodd"
}

export default class Pin extends PureComponent {
  render() {
    const { size = 20, mode = "WALK" } = this.props

    return (
      <svg
        height={size}
        viewBox="0 0 24 24"
        style={{
          ...pinStyle,
          transform: `translate(${-size / 2}px,${-size}px)`
        }}
      >
        <path d={MODE_MARKERS[mode]} />
      </svg>
    )
  }
}
