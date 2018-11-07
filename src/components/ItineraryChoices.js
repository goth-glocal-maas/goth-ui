import React, { Component, Fragment } from "react"
import { Subscribe } from 'unstated'
import _ from "lodash"

import ItineraryChoiceItem from "./ItineraryChoiceItem"
import PlanContainer from '../unstated/plan'

export default class ItineraryChoices extends Component {
  render() {
    const { itineraries } = this.props
    if (_.isEmpty(itineraries)) {
      return null
    }
    return (
      <Subscribe to={[PlanContainer]}>
        {plan => {
          console.log(`plan state: `, plan.state)
          return (
            <Fragment>
              {itineraries &&
                Object.keys(itineraries).map(one => (
                  <ItineraryChoiceItem
                    key={`iti-choice-item-${one}`}
                    {...itineraries[one]}
                  />
                ))}
            </Fragment>
          )
        }}
      </Subscribe>
    )
  }
}
