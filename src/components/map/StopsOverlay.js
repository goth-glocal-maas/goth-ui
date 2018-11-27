import PropTypes from "prop-types"
import React, { Component } from "react"
import { Query } from "react-apollo"
import geoViewport from "@mapbox/geo-viewport"
import ReactMapGL, {
  BaseControl
} from "react-map-gl"

import { alphaify } from "../../utils/alphaify"
import { AVAILABLE_STOPS_QUERY } from "../../constants/GraphQLCmd"

export default class StopsOverlay extends Component {
  static propTypes = {
    viewport: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      zoom: PropTypes.number.isRequired,
      width: PropTypes.number,
      height: PropTypes.number
    })
  }


  render() {
    console.log('viewport: ', this.props.viewport)
    const {
      viewport: { latitude, longitude, zoom, width, height, project }
    } = this.props
    const skip = width === undefined || height === undefined || zoom > 14
    const [minLon, minLat, maxLon, maxLat] = geoViewport.bounds(
      [longitude, latitude],
      zoom,
      [width, height]
    )
    console.log('project: ', project)
    const stopsQuery = {
      minLat,
      minLon,
      maxLat,
      maxLon
    }
    return (
      <Query query={AVAILABLE_STOPS_QUERY} variables={stopsQuery} skip={skip}>
        {({ loading, error, data }) => {
          console.log(loading, error, data)
          return (
            <div>
              {loading && <p>Loading...</p>}
              {!loading && <p>Good...</p>}
            </div>
          )
        }}
      </Query>
    )
  }
}
