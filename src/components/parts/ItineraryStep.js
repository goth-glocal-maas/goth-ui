import React from "react"
import styled from "styled-components"
import { red } from "../../constants/color"
import _ from "lodash"
import ModeIcon from "./ModeIcon"
import { getHHMM } from '../../utils/fn'

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

const ItineraryStep = props => {
  if (_.isEmpty(props)) {
    return <React.Fragment />
  }
  const {
    minStartTime,
    maxEndTime,
    maxPercent,
    itinerary: { startTime, endTime, legs }
  } = props
  const TotalTripSec = (endTime - startTime) / 1000
  const percentPerSec = maxPercent / TotalTripSec
  let accumulatePercent = 0
  // console.log(minStartTime, startTime)
  // console.log(maxEndTime, endTime, maxPercent)
  // console.log("total trip (s): ", TotalTripSec)
  // console.log("percentPerSec: ", percentPerSec)
  let prevEndTime;

  // TODO: fix percent over 100%
  // http://localhost:3000/#/p/7.889143162249294,98.37364192222041/7.830765363613014,98.29454086190445/0?ts=1542348791596

  return (
    <PaddingBox>
      <BarContainer>
        <BarBar style={{ width: `${maxPercent}%` }}>
          <BarDots>
            {legs.map((leg, i) => {
              // console.log(prevEndTime)
              const waitingTime = (!prevEndTime ? 0 : leg.startTime - prevEndTime)
              prevEndTime = leg.endTime
              // console.log('waiting time : ', waitingTime)
              const waitingPercent = waitingTime/1000 * percentPerSec

              let percent
              if (i === 0) {
                percent =
                  ((startTime - minStartTime) / (endTime - minStartTime)) * 100
                percent += leg.duration * percentPerSec
              } else {
                percent = leg.duration * percentPerSec
              }
              const currPercent = accumulatePercent
              accumulatePercent += (waitingPercent + percent)
              const showIcon = percent > 4
              const iconColor = leg.routeColor ? `#${leg.routeColor}` : red

              //console.log(leg.mode, currPercent, waitingPercent, percent, accumulatePercent, leg.duration, leg)

              return (
                <Dot
                  key={`bardot-${minStartTime}-${leg.distance}`}
                  style={{ left: `${currPercent}%` }}
                >
                  {showIcon && <span
                    className="icon top"
                    style={{color: iconColor}}
                  >
                    <ModeIcon mode={leg.mode} size="1x" />
                  </span>}
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