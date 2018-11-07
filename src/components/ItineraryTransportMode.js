import React, { Component } from "react"
import { TRANSPORT_MODES } from "../constants/mode"
import ModeIcon from "./parts/ModeIcon"

export default class ItineraryTransportMode extends Component {

  handleOnClick(evt) {
    this.props.onChanged(evt.target.attributes.dataindex.value)
  }

  render() {
    return (
      <React.Fragment>
        {Object.keys(TRANSPORT_MODES).map(k => (
          <button
            key={`m-${k}`}
            dataindex={k}
            onClick={this.handleOnClick.bind(this)}
          >
            <ModeIcon size="sm" mode={TRANSPORT_MODES[k]} />
          </button>
        ))}
      </React.Fragment>
    )
  }
}

// /* <li key={`tmode-${k}`}>{TRANSPORT_MODES[k]}</li> */
