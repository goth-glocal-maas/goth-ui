import React, { Component } from "react"
import styled, { keyframes } from "styled-components"
import { Query } from "react-apollo"
import { Link, Route, Switch } from 'react-router-dom'

import ItineraryODInput from "./ItineraryODInput"
import ItineraryTransportMode from "./ItineraryTransportMode"
import ItineraryTimeSelector from "./ItineraryTimeSelector"
import ItineraryChoices from "./ItineraryChoices"
import { ROUTEPLAN_QUERY } from "../constants/GraphQLCmd"
import { getCurrentTimeForPlan } from "../utils/fn"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const toHide = keyframes`
  0% {
    top: 0;
  }
  100% {
    top: 90%'
  }
`

export const toShow = keyframes`
  0% {
    top: 90%'
  }
  100% {
    top: 0;
  }
`

const Container = styled.div`
  position: fixed;
  top: ${props => (props.hide ? "90%" : 0)};
  left: 0;
  width: 100%;
  height: 100%;
  animation: ${toHide} 1s linear;

  background: #efefef;
  z-index: 1200;
  display: block;
`

export default class ItineraryPicker extends Component {
  state = {
    hide: false
  }

  render() {
    const { match: { params: { from, to } } } = this.props
    const { location: { search } } = this.props
    let planParams = getCurrentTimeForPlan(search ? search.split('ts=')[1] : '')
    planParams.from = from
    planParams.to = to
    return (
      <Query query={ROUTEPLAN_QUERY} variables={planParams}>
        {({ loading, error, data }) => {
          console.log("route plan loading", loading, " => ", data)
          if (loading && !this.state.itineraryPickerVisible) {
            this.setState({ itineraryPickerVisible: true })
          }

          let result
          if (loading) {
            result = <FontAwesomeIcon icon="cog"  size="2x" spin />
          } else if (error) {
            result = <p>{error.message}</p>
          } else if (data.route_plan === null) {
            result = <p>There is no route.</p>
          } else {
            result = <ItineraryChoices {...data.route_plan} />
          }

          return (
            <Container visible={true}>
              <Link to="/">Back</Link>
              <ItineraryODInput origin={from} destination={to} />
              <ItineraryTransportMode />
              <ItineraryTimeSelector />
              {result}
            </Container>
          )
        }}
      </Query>
    )
  }
}
