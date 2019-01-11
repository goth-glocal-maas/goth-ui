import React, { Component, Fragment } from "react"
import _ from "lodash"

import ItineraryChoiceItem from "./ItineraryChoiceItem"


export default class ItineraryChoices extends Component {
  render() {
    const { itineraries } = this.props
    if (_.isEmpty(itineraries)) {
      return null
    }
    return (
      <Fragment>
        {itineraries &&
          Object.keys(itineraries).map(one => (
            <ItineraryChoiceItem
              key={`iti-choice-item-${one}`}
              index={one}
              {...itineraries[one]}
            />
          ))}
      </Fragment>
    )
  }
}
