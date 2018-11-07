import React, { Component, Fragment } from "react"
import polyline from "@mapbox/polyline"
import { Subscribe } from "unstated"
import { GeoJSON } from "react-leaflet"
import PlanContainer from "../../unstated/plan"

export default class PlanPolygonOverlay extends Component {
  renderLegs() {
    return
  }

  render() {
    return (
      <Subscribe to={[PlanContainer]}>
        {plan => {
          const { itineraries, picked } = plan.state
          if (itineraries.length === 0) {
            return <span>Yeah</span>
          }
          const pickedIti = itineraries[picked]
          const legs = pickedIti.legs
          return (
            <Fragment>
              {Object.keys(legs).map(ind => {
                let style = {
                  color: "#a63eff",
                  weight: 5,
                  opacity: 0.65,
                  dashArray: "10 8",
                }
                if (legs[ind].routeColor) {
                  style.routeColor = `#${legs[ind].routeColor}`
                }
                return (
                  <GeoJSON
                    key={`${plan.state.hash}-leg-${ind}`}
                    data={polyline.toGeoJSON(
                      legs[ind]["legGeometry"]["points"]
                    )}
                    style={style}
                  />
                )
              })}
            </Fragment>
          )
        }}
      </Subscribe>
    )
  }
}
