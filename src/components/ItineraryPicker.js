import React, { Component } from "react"
import styled, { keyframes } from "styled-components"
import { Query } from "react-apollo"
import { Link } from "react-router-dom"
import { Subscribe } from "unstated"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import ItineraryODInput from "./ItineraryODInput"
import ItineraryTransportMode from "./ItineraryTransportMode"
import ItineraryTimeSelector from "./ItineraryTimeSelector"
import ItineraryChoices from "./ItineraryChoices"
import { ROUTEPLAN_QUERY } from "../constants/GraphQLCmd"
import { getCurrentTimeForPlan } from "../utils/fn"
import PlanContainer from "../unstated/plan"
import { TRANSPORT_MODES } from "../constants/mode"

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
    hide: false,
    mode: 0
  }

  handleModeChange(modeIndex) {
    this.setState({ mode: modeIndex })
  }

  async handleUnstatedPlan(unstatedContainer, value) {
    await unstatedContainer.setItineraries(value)
    return true
  }

  render() {
    const {
      match: {
        params: { from, to }
      }
    } = this.props
    const {
      location: { search }
    } = this.props
    const tsmp = search ? search.split("ts=")[1] : new Date().getTime()
    let planParams = getCurrentTimeForPlan(tsmp)
    planParams.from = from
    planParams.to = to
    planParams.mode = TRANSPORT_MODES[this.state.mode]

    return (
      <Subscribe to={[PlanContainer]}>
        {plan => (
          <Query query={ROUTEPLAN_QUERY} variables={planParams}>
            {({ loading, error, data }) => {
              let result
              if (loading) {
                result = <FontAwesomeIcon icon="cog" size="2x" spin />
              } else if (error) {
                result = <p>{error.message}</p>
              } else if (data.route_plan === null) {
                result = <p>There is no route.</p>
              } else {
                result = <ItineraryChoices {...data.route_plan} />
                const itiHash = `${from.slice(0, 6)}${to.slice(0, 6)}${
                  planParams.mode
                }T${tsmp}`
                if (plan.state.hash !== itiHash) {
                  plan.setItineraryResult(
                    from,
                    to,
                    tsmp,
                    data.route_plan.itineraries,
                    itiHash
                  )
                }
              }

              return (
                <Container visible={true}>
                  <Link to="/">Back</Link>
                  <ItineraryODInput origin={from} destination={to} />
                  <ItineraryTransportMode
                    selected={this.state.mode}
                    onChanged={this.handleModeChange.bind(this)}
                  />
                  <ItineraryTimeSelector />
                  {result}
                </Container>
              )
            }}
          </Query>
        )}
      </Subscribe>
    )
  }
}
