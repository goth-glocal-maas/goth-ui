import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { red } from "../../constants/color"
import _ from "lodash"
import ModeIcon from "./ModeIcon"
import { getHHMM } from "../../utils/fn"

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
  left: ${props => (props.left ? props.left : 0)}%;
  width: ${props => (props.percent ? props.percent : 100)}%;
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
    percentPerSec,
    itinerary: { startTime, endTime, legs }
  } = props
  // calculate very first waiting time
  const initStartPercent =
    startTime === minStartTime ? 0 : (startTime - minStartTime) * percentPerSec
  // end of this leg percent
  const percentAtEndOfLeg = (endTime - startTime) * percentPerSec
  const legPercentPerSec = 100 / (endTime - startTime)
  return (
    <PaddingBox>
      <BarContainer>
        <BarBar left={initStartPercent} percent={percentAtEndOfLeg}>
          <BarDots>
            {legs.map((leg) => {
              const startPercent =
                (leg.startTime - startTime) * legPercentPerSec
              const iconColor = leg.routeColor ? `#${leg.routeColor}` : red
              const showIcon =
                (leg.endTime - leg.startTime) * legPercentPerSec > 1.5
              return (
                <Dot
                  key={`bardot-${minStartTime}-${leg.distance}`}
                  style={{ left: `${startPercent}%` }}
                >
                  {showIcon && (
                    <span className="icon top" style={{ color: iconColor }}>
                      <ModeIcon mode={leg.mode} size="1x" />
                    </span>
                  )}
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

ItineraryStep.propTypes = {
  minStartTime: PropTypes.number.isRequired,
  maxEndTime: PropTypes.number.isRequired,
  percentPerSec: PropTypes.number.isRequired,
  itinerary: PropTypes.object.isRequired // shape is too complicated for this
}

export default ItineraryStep
