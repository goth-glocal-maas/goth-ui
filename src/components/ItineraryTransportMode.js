import React, { Component } from 'react'
import { TRANSPORT_MODES } from '../constants/mode'
import ModeIcon from "./parts/ModeIcon"

export default class ItineraryTransportMode extends Component {
  render() {
    return (
      <React.Fragment>
        {Object.keys(TRANSPORT_MODES).map(k => (
          <button><ModeIcon size="s,m" mode={TRANSPORT_MODES[k]} /></button>

        ))}
      </React.Fragment>
    )
  }
}

// /* <li key={`tmode-${k}`}>{TRANSPORT_MODES[k]}</li> */
