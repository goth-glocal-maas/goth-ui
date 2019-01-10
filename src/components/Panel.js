import React, { Component, Fragment } from "react"
import styled from "styled-components"
import { Query } from "react-apollo"
import { Subscribe } from "unstated"
import _ from "lodash"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"

import PlanContainer from "../unstated/plan"
import {
  yellow,
  black,
  grayBackground,
  darkmagenta,
  gray
} from "../constants/color"
import ODInput from "./ODInput"
import ItineraryChoiceItem from "./ItineraryChoiceItem"
import ItineraryDirection from "./ItineraryDirection"
import PanelModeSelector from "./parts/PanelModeSelector"
import { ROUTEPLAN_QUERY } from "../constants/GraphQLCmd"
import { getCurrentTimeForPlan, getGoodTrips } from "../utils/fn"
import { TRANSPORT_MODES } from "../constants/mode"
import User from "./User"
import Signout from "./Signout"
import { version, date } from "../../package.json"

const Box = styled.div`
  width: 100%;
  max-width: 360px;
  height: 100vh;
  z-index: 3;
  box-shadow: 1.5px 2px 2px 0 rgba(0, 0, 0, 0.2);
  transition: transform 0.5s linear;

  @media (max-width: 450px) {
    width: 100%;
    max-width: 100%;
    height: 60vh;
    overflow-y: scroll;

    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  }
`

const BoxTitle = styled.div`
  width: 100%;
  background: ${yellow};

  padding: 0.5rem 1rem;
  font-size: 2rem;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  a {
    color: ${black};
  }
  a:hover {
    color: ${darkmagenta};
  }
`

const BoxContent = styled.div`
  padding: 0.5rem 0.5rem 1rem 1.5rem;
  background: ${grayBackground};
`

const MutedHeader = styled.p`
  color: #888;
  font-size: 1.3rem;
  display: flex;
  justify-content: space-between;
`

const BoxScrollOffset = styled.div`
  padding-right: 1rem;
`

const Footer = styled.span`
  font-size: 1.2rem;
  color: ${gray};

  a {
    color: ${gray};
  }
`

const EmptyDiv = styled.div`
  background: #fff;
  box-shadow: 1px 1px 1px 0 rgba(0, 0, 0, 0.2);
  padding: 1.3rem;
  border-radius: 0.5rem;

  margin: 0 0 1rem;
  transition: background-color 200ms ease;

  :hover {
    background: #fef0f0;
  }
`

class Panel extends Component {
  state = {
    initTmsp: 0
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

  componentWillReceiveProps(nextProps) {
    /* This update URL to current one, so that user can copy and share */
    const {
      history,
      location: { pathname, search },
      match: { params }
    } = nextProps
    const { from, to, mode } = nextProps.plan.state
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
          const hasTrip =
            hasData &&
            !_.isEmpty(data.route_plan) &&
            data.route_plan.itineraries
          const goodTrips = hasTrip
            ? getGoodTrips(data.route_plan.itineraries)
            : []

          if (!loading && !error && hasTrip && hash !== itiHash) {
            plan.setItineraryResult(from, to, tmsp, goodTrips, itiHash)
          }
          const pickedTrip = goodTrips[picked]
          return (
            <Box>
              <BoxTitle>
                GoTH
                {loading && <FontAwesomeIcon icon="cog" size="1x" spin />}
                <User>
                  {({ data: { me } }) => {
                    if (me === undefined) return null
                    if (me)
                      return (
                        <span>
                          {me.name} <Signout />
                        </span>
                      )
                    return (
                      <Link to="/login/">
                        <FontAwesomeIcon icon="sign-in-alt" />
                      </Link>
                    )
                  }}
                </User>
              </BoxTitle>
              <BoxContent>
                {!pickedTrip && (
                  <Fragment>
                    <ODInput
                      origin={from}
                      destination={to}
                      switchOD={() => plan.switchOD()}
                    />
                    <PanelModeSelector
                      mode={mode}
                      setMode={mode => plan.setMode(mode)}
                      setTime={timeDelta => plan.setTime(timeDelta)}
                      timestamp={tmsp}
                    />
                  </Fragment>
                )}
                {planParams.from && planParams.to && (
                  <BoxScrollOffset>
                    {!pickedTrip && (
                      <Fragment>
                        <MutedHeader>
                          <span>Recommended routes</span>
                          {loading && (
                            <FontAwesomeIcon icon="cog" size="1x" spin />
                          )}
                        </MutedHeader>
                        {goodTrips && this.renderItineraryChoices(goodTrips)}
                      </Fragment>
                    )}
                    {!loading && goodTrips.length === 0 && (
                      <EmptyDiv>
                        <FontAwesomeIcon
                          icon="exclamation-triangle"
                          size="1x"
                        />
                        &nbsp; There is no route.
                      </EmptyDiv>
                    )}
                    {pickedTrip && (
                      <Fragment>
                        <MutedHeader>
                          <a onClick={() => plan.setPickedItinerary(-1)}>
                            back
                          </a>
                        </MutedHeader>
                        <ItineraryDirection trip={pickedTrip} />
                      </Fragment>
                    )}
                  </BoxScrollOffset>
                )}
                <Footer>
                  v.{version}.{date}
                  &nbsp;&nbsp;
                  <a href="javascript:location.reload(true)">
                      <FontAwesomeIcon icon="sync" size="sm" />
                  </a>
                </Footer>
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
