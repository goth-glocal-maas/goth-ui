import React, { Component, Fragment } from "react"

export default class ItineraryODInput extends Component {

  render() {
    const { origin, destination } = this.props
    return (
      <Fragment>
        <li>
          <input type="text" disabled="disabled" value={origin} />
        </li>
        <li>
          <input type="text" disabled="disabled" value={destination} />
        </li>
      </Fragment>
    )
  }
}
