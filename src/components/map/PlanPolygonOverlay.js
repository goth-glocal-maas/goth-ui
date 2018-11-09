import React, { Component, Fragment } from "react"
import polyline from "@mapbox/polyline"
import { Subscribe } from "unstated"
import { CircleMarker, GeoJSON } from "react-leaflet"
import PlanContainer from "../../unstated/plan"
import { MODE_STYLES } from "../../constants/mode"


const BASE_STYLE = {
  color: "#a63eff",
  weight: 5,
  opacity: 0.65,
  dashArray: "10 8",
}

export default class PlanPolygonOverlay extends Component {

  renderLegStartEnd(ind, leg, hash) {
    const { from, to } = leg
    return <Fragment>
      <CircleMarker
        key={`${hash}-leg-${ind}-from`}
        center={[from.lat, from.lon]}
        radius={5}
        fillColor={"rgb(33, 150, 243)"}
        fillOpacity={0.9}
        color={"white"}
        stroke
        weight={2}
        opacity={1}
        className="my-location-marker"
      />
      <CircleMarker
        key={`${hash}-leg-${ind}-to`}
        center={[to.lat, to.lon]}
        radius={5}
        fillColor={"rgb(33, 150, 243)"}
        fillOpacity={0.9}
        color={"rgba(33, 150, 243, 1)"}
        stroke
        weight={2}
        opacity={1}
        className="my-location-marker"
      />
    </Fragment>
  }

  renderLegLine(ind, leg, hash) {
    let style = {
      ...BASE_STYLE,
      ...(MODE_STYLES[leg.mode] || {})
    }

    if (leg.routeColor) {
      style.color = `#${leg.routeColor}`
    }
    return <GeoJSON
      key={`${hash}-leg-${ind}`}
      data={polyline.toGeoJSON(
        leg["legGeometry"]["points"]
      )}
      style={style}
    />
  }

  render() {
    return (
      <Subscribe to={[PlanContainer]}>
        {plan => {
          const { itineraries, picked, hash } = plan.state
          if (itineraries.length === 0) {
            return <span></span>
          }
          const pickedIti = itineraries[picked]
          const legs = pickedIti.legs
          console.log('itipick --> ', picked, hash, pickedIti)
          return (
            <Fragment>
              {Object.keys(legs).map(ind => {
                const leg = legs[ind]
                return (
                  <Fragment>
                    {this.renderLegStartEnd(ind, leg, hash)}
                    {this.renderLegLine(ind, leg, hash)}
                  </Fragment>
                )
              })}
            </Fragment>
          )
        }}
      </Subscribe>
    )
  }
}
