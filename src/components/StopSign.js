import React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"
import ModeIcon from "./parts/ModeIcon"

import { getHHMMFromSeconds } from "../utils/fn"
import { blue } from "../constants/color"

const STOP_SIGN_QUERY = gql`
  query STOP_SIGN_QUERY($stopId: String!) {
    stop_detail(stop_id: $stopId) {
      name
      locationType
      wheelchairBoarding
    }
    stop_route(stop_id: $stopId) {
      id
      shortName
      longName
      mode
      color
      agencyName
    }
    stop_stoptimes(stop_id: $stopId) {
      times {
        headsign
        tripId
        stopId
        stopCount
        stopIndex
        scheduledArrival
      }
      pattern {
        id
        desc
      }
    }
  }
`

const SignBox = styled.div`
  font-size: 1.6rem;
  h1 {
    font-size: 1.7rem;
    font-weight: 600;
    margin: 0.2rem 0;
  }
`

const InlineList = styled.ul`
  list-style: none;
  margin-left: 0;
  font-size: 1.2rem;

  li {
    display: inline-block;
    padding-left: 4px;
    padding-right: 5px;
  }
`

const StopTimeItem = styled.li`
  font-size: 1.3rem;
  font-weight: 500;
  background: ${blue};
  margin-left: 2px;
  margin-right: 2px;
`

const StopTimeLine = styled.div`
  display: table;
  div {
    display: table-cell;
  }
  .time {
    font-size: 1.3rem;
    background: ${blue};
    padding: 2px 5px;
    margin-right: 1rem;
  }
`

const getRouteFromStopTime = (routes, stoptimesPattern) => {
  const { id } = stoptimesPattern
  const rIds = id.split(":")
  const routeId = rIds.splice(0, 2).join(":")
  const fR = routes.filter(r => r.id === routeId)
  return fR[0]
}

const StopTimeBox = props => {
  const { times } = props
  if (times[0].headsign) {
    return times.map((st, ind2) => (
      <StopTimeLine key={`slt-${ind2}`}>
        <div>
          <span className="time">
            {getHHMMFromSeconds(st.scheduledArrival)}
          </span>
        </div>
        <div>{st.headsign}</div>
      </StopTimeLine>
    ))
  }
  return (
    <InlineList>
      {times.map((st, ind2) => (
        <StopTimeItem key={`slt-${ind2}`}>
          {getHHMMFromSeconds(st.scheduledArrival)}
        </StopTimeItem>
      ))}
    </InlineList>
  )
}

const StopSign = props => (
  <Query
    {...props}
    query={STOP_SIGN_QUERY}
    variables={{ stopId: props.stopId }}
  >
    {({ loading, error, data }) => {
      if (loading) return <FontAwesomeIcon icon="cog" size="1x" spin />
      if (error) return <p>{error.message}</p>
      const {
        stop_detail: { name },
        stop_route,
        stop_stoptimes
      } = data
      return (
        <SignBox>
          <h1>{name}</h1>
          {stop_stoptimes.map((el, ind) => {
            const rt = getRouteFromStopTime(stop_route, el.pattern)
            return (
              <div key={`st-${ind}`}>
                <span style={{ color: `#${rt.color}` }} title={rt.agencyName}>
                  <ModeIcon mode={rt.mode} size="1x" />
                  &nbsp;{rt.longName}
                </span>
                <StopTimeBox {...el} />
              </div>
            )
          })}
        </SignBox>
      )
    }}
  </Query>
)

StopSign.propTypes = {
  stopId: PropTypes.string.isRequired
}

export default StopSign
