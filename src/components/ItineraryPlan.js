import React, { Component, Fragment } from 'react'

import PlanPolygonOverlay from './map/PlanPolygonOverlay'
import PlanOverview from './PlanOverview'

export default class ItineraryPlan extends Component {
  render() {
    return (
      <Fragment>
        <PlanPolygonOverlay />
        <PlanOverview />
      </Fragment>
    )
  }
}
