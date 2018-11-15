import React, { Component, Fragment } from "react"
import styled from "styled-components"
import { Query } from "react-apollo"
import { Subscribe } from "unstated"
import _ from "lodash"

import PlanContainer from "../unstated/plan"
import { yellow, grayBackground } from "../constants/color"
import ODInput from "./ODInput"
import ItineraryChoiceItem from "./ItineraryChoiceItem"
import ItineraryDirection from "./ItineraryDirection"
import PanelModeSelector from "./parts/PanelModeSelector"
import { ROUTEPLAN_QUERY } from "../constants/GraphQLCmd"
import { getCurrentTimeForPlan } from "../utils/fn"
import { TRANSPORT_MODES } from "../constants/mode"

const Box = styled.div`
  width: 100%
  max-width: 360px;
  max-height: calc(100% - 10px); // 100vh;

  position: fixed;
  left: 5px;
  top: 5px;
  z-index: 3;  // mapbox logo on z-index 2

  // margin: 0.5rem;
  background: white;

  box-shadow: 1.5px 2px 2px 0 rgba(0,0,0,.2);
  display: flex;
  flex-direction: column;

  @media (max-width: 450px) {
    width: 98%;
    height: 50vh;

    top: 45vh;
    left: 5px;
    width: calc(100% - 10px);
    max-width: 450px;
    box-shadow: 1px 1px 3px rgba(0,0,0,.2);
  }
`

const BoxTitle = styled.div`
  width: 100%;
  background: ${yellow};

  padding: 0.5rem 1rem;
  font-size: 2rem;
`

const BoxContent = styled.div`
  padding: 0.5rem 0.5rem 0.5rem 1.5rem;
  background: ${grayBackground};

  overflow-y: auto;
`

const MutedHeader = styled.p`
  color: #888;
  font-size: 1.3rem;
`

const BoxScrollOffset = styled.div`
  padding-right: 1rem;
`

class Panel extends Component {

  componentWillReceiveProps(nextProps) {
    /* This update URL to current one, so that user can copy and share */
    const {
      history,
      location: { pathname, search },
      match: { params }
    } = nextProps
    const { from, to, mode, timestamp } = nextProps.plan.state
    const hasData = from.length > 0 && to.length > 0
    const _from = from.join(",")
    const _to = to.join(",")
    if (
      hasData &&
      (params.from !== _from || params.to !== _to || +params.mode !== +mode)
    ) {
      const nUrl = `/p/${_from}/${_to}/${mode}?ts=${timestamp}`
      const currUrl = `${pathname}${search}`
      if (currUrl !== nUrl)
        history.push(`/p/${_from}/${_to}/${mode}?ts=${timestamp}`)
    }
  }

  renderItineraryChoices(route_plan) {
    if (_.isEmpty(route_plan)) return <Fragment />

    const { itineraries } = route_plan
    const startTimes = itineraries.map(i => i.startTime)
    const endTimes = itineraries.map(i => i.endTime)
    const minStartTime = _.min(startTimes)
    const maxEndTime = _.max(endTimes)

    return (
      <Fragment>
        {itineraries.map((one, index) => (
          <ItineraryChoiceItem
            key={`itiCI-${index}`}
            itinerary={one}
            minStartTime={minStartTime}
            maxEndTime={maxEndTime}
          />
        ))}
      </Fragment>
    )
  }

  render() {
    const {
      location: { search },
      match: { params },
      plan
    } = this.props

    const { from, to, mode, timestamp, hash } = plan.state
    let tmsp = timestamp > 0 ? timestamp : new Date().getTime()
    let md = mode

    if (params.from && params.to && from.length === 0 && to.length === 0) {
      const nFrom = params.from.split(",").map(i => +i)
      const nTo = params.to.split(",").map(i => +i)
      plan.setOD({ from: nFrom, to: nTo })
      if (search) tmsp = search.split("ts=")[1]
      if (params.mode) {
        plan.setMode(+params.mode)
        md = +params.mode
      }
      return <p>Loading...</p>
    }

    if (timestamp === -1) plan.setTimestamp(tmsp)

    const hasData = from.length > 0 && to.length > 0
    let planParams = getCurrentTimeForPlan(tmsp)
    planParams.from = from.join(",")
    planParams.to = to.join(",")
    planParams.mode = TRANSPORT_MODES[md]

    return (
      <Query query={ROUTEPLAN_QUERY} variables={planParams} skip={!hasData}>
        {({ loading, error, data }) => {
          // console.log(loading, error, data)
          const itiHash = `${planParams.from}${planParams.to}${md}T${tmsp}`
          if (
            !loading &&
            !error &&
            data &&
            data.route_plan &&
            data.route_plan.itineraries &&
            hash !== itiHash
          ) {
            plan.setItineraryResult(
              from,
              to,
              tmsp,
              data.route_plan.itineraries,
              itiHash
            )
          }

          return (
            <Box>
              <BoxTitle>GoTH</BoxTitle>
              <BoxContent>
                <ODInput origin={from} destination={to} />
                <PanelModeSelector
                  mode={mode}
                  setMode={mode => plan.setMode(mode)}
                />
                <BoxScrollOffset>
                  <MutedHeader>Recommended routes</MutedHeader>
                  {data && this.renderItineraryChoices(data.route_plan)}
                  {/* <ItineraryDirection /> */}
                </BoxScrollOffset>
              </BoxContent>
            </Box>
          )
        }}
      </Query>
    )
  }
}

export default props => {
  return (
    <Subscribe to={[PlanContainer]}>
      {plan => <Panel {...props} plan={plan} />}
    </Subscribe>
  )
}
