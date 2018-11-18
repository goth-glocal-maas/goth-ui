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
import { getCurrentTimeForPlan, getGoodTrips } from "../utils/fn"
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
  state = {
    initTmsp: 0
  }

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
    const _tmsp = search.split("ts=")[1]
    if (
      hasData &&
      (params.from !== _from ||
        params.to !== _to ||
        +params.mode !== +mode ||
        +params.timestamp !== +_tmsp)
    ) {
      const newTimestamp = _tmsp === undefined ? new Date().getTime() : +_tmsp
      const nUrl = `/p/${_from}/${_to}/${mode}?ts=${newTimestamp}`
      const currUrl = `${pathname}${search}`
      if (currUrl !== nUrl)
        history.push(`/p/${_from}/${_to}/${mode}?ts=${newTimestamp}`)
    }
  }

  /* componentWillMount() {
    const {
      location: { search },
      match: { params },
      plan
    } = this.props

    const { from, to, mode, timestamp } = plan.state
    let tmsp = timestamp > 0 ? timestamp : new Date().getTime()
    let md = mode

    if (params.from && params.to && from.length === 0 && to.length === 0) {
      const nFrom = params.from.split(",").map(i => +i)
      const nTo = params.to.split(",").map(i => +i)
      plan.setOD({ from: nFrom, to: nTo })
    }
    const urlTmsp = search.split("ts=")[1]
    if (urlTmsp !== undefined)
      plan.setTimestamp(+urlTmsp)
    if (params.mode) {
      plan.setMode(+params.mode)
      md = +params.mode
    }
  } */

  renderItineraryChoices(trips) {
    if (trips.length === 0) return <Fragment />

    const startTimes = trips.map(i => i.startTime)
    const endTimes = trips.map(i => i.endTime)
    const minStartTime = _.min(startTimes)
    const maxEndTime = _.max(endTimes)

    return (
      <Fragment>
        {trips.map((one, index) => (
          <ItineraryChoiceItem
            key={`itiCI-${index}`}
            index={index}
            itinerary={one}
            minStartTime={minStartTime}
            maxEndTime={maxEndTime}
          />
        ))}
      </Fragment>
    )
  }

  componentWillMount() {
    // grab info from URL to UNSTATED
    const {
      location: { search },
      match: { params },
      plan
    } = this.props
    const now = new Date().getTime()
    const _tmsp = search.split("ts=")[1]
    let tmsp
    if (+_tmsp === -1 || _tmsp === undefined) {
      tmsp = now
    } else {
      tmsp = +_tmsp
    }
    // no need to set in UNSTATED since when itinerary is up,
    // that would be updated automatically
    this.setState({ initTmsp: tmsp })

    const { from, to } = plan.state
    if (params.from && params.to && from.length === 0 && to.length === 0) {
      const nFrom = params.from.split(",").map(i => +i)
      const nTo = params.to.split(",").map(i => +i)
      plan.setOD({ from: nFrom, to: nTo })
    }
    if (params.mode) plan.setMode(params.mode)
  }

  render() {
    const {
      match: { params },
      plan
    } = this.props

    const { from, to, mode, timestamp, hash, picked } = plan.state
    let md = mode

    const tmsp = timestamp > 0 ? timestamp : this.state.initTmsp

    if (params.from && params.to && from.length === 0 && to.length === 0) {
      return <p>Loading...</p>
    }

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
          const hasTrip = hasData && !_.isEmpty(data.route_plan)
          const goodTrips = hasTrip
            ? getGoodTrips(data.route_plan.itineraries)
            : []

          if (!loading && !error && hasTrip && hash !== itiHash) {
            plan.setItineraryResult(from, to, tmsp, goodTrips, itiHash)
          }
          const pickedTrip = goodTrips[picked]
          return (
            <Box>
              <BoxTitle>GoTH</BoxTitle>
              <BoxContent>
                {!pickedTrip && (
                  <Fragment>
                    <ODInput origin={from} destination={to} />
                    <PanelModeSelector
                      mode={mode}
                      setMode={mode => plan.setMode(mode)}
                      timestamp={tmsp}
                    />
                  </Fragment>
                )}
                <BoxScrollOffset>
                  {!pickedTrip && (
                    <Fragment>
                      <MutedHeader>Recommended routes</MutedHeader>
                      {/* TODO: add spinner */}
                      {goodTrips && this.renderItineraryChoices(goodTrips)}
                    </Fragment>
                  )}
                  {pickedTrip && (
                    <Fragment>
                      <MutedHeader>
                        <a onClick={() => plan.setPickedItinerary(-1)}>back</a>
                      </MutedHeader>
                      <ItineraryDirection trip={pickedTrip} />
                    </Fragment>
                  )}
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
