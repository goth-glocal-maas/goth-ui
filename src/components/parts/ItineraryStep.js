import React from "react"
import styled from "styled-components"
import { red } from "../../constants/color"
import _ from "lodash"
import ModeIcon from "./ModeIcon"

const PaddingBox = styled.div`
  padding: 2.5rem 1.5rem 1.5rem;
`

const BarContainer = styled.div`
  height: 6px;
  background-color: #eee;
  border-radius: 3px;
  grid-column-start: 1;
  grid-column-end: span 5;
  grid-row-start: 2;
`

const BarBar = styled.div`
  height: 100%;
  border-radius: 3px;
  position: relative;
  background-color: ${red};
`

const BarDots = styled.div`
  position: relative;
  top: 50%;
`

const Dot = styled.div`
  width: 10px;
  border-width: 3px;
  top: 0;
  height: 10px;
  border-style: solid;
  position: absolute;
  margin-top: -5px;
  margin-left: -5px;
  background-color: white;
  border-radius: 50%;
  box-sizing: border-box;
  border-color: ${red};

  span {
    font-size: 1rem;
    position: relative;
    left: -200%;
  }
  span.icon {
    left: -0.5rem;
    font-size: 1.5rem;
    span.bottom2 {
      position: relative;
      top: 0;
      left: 0;
    }
  }
  span.top {
    top: -2.5rem;
  }
  span.bottom {
    top: 0.5rem;
  }
`

const getHHMM = tmsp => {
  const d = new Date(tmsp)
  const hh = d.getHours()
  const mm = d.getMinutes()
  return `${hh < 10 ? `0${hh}` : hh}:${mm < 10 ? `0${mm}` : mm}`
}

const ItineraryStep = props => {
  if (_.isEmpty(props)) {
    return <React.Fragment />
  }
  const {
    minStartTime,
    maxPercent,
    itinerary: { startTime, endTime, legs }
  } = props
  const TotalTripSec = (endTime - startTime) / 1000
  const percentPerSec = maxPercent / TotalTripSec
  let accumulatePercent = 0

  return (
    <PaddingBox>
      <BarContainer>
        <BarBar style={{ width: `${maxPercent}%` }}>
          <BarDots>
            {legs.map((leg, i) => {
              let percent
              if (i === 0) {
                percent =
                  ((startTime - minStartTime) / (endTime - minStartTime)) * 100
              } else {
                percent = leg.duration * percentPerSec
              }
              accumulatePercent += percent

              return (
                <Dot
                  key={`bardot-${minStartTime}-${leg.distance}`}
                  style={{ left: `${accumulatePercent}%` }}
                >
                  <span
                    className="icon top"
                    style={{
                      color: leg.routeColor ? `#${leg.routeColor}` : red
                    }}
                  >
                    <ModeIcon mode={leg.mode} size="1x" />
                  </span>
                </Dot>
              )
            })}
            <Dot style={{ left: "100%" }}>
              <span className="top">{getHHMM(endTime)}</span>
            </Dot>
          </BarDots>
        </BarBar>
      </BarContainer>
    </PaddingBox>
  )
}

export default ItineraryStep
