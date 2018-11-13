import React from "react"
import styled from "styled-components"
import { red } from "../../constants/color"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

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
  return (
    <PaddingBox>
      <BarContainer>
        <BarBar style={{ width: "68%" }}>
          <BarDots>
            <Dot style={{ left: "2%" }}>
              <span className="icon top">
                <FontAwesomeIcon icon="walking" size="1x" />
              </span>
            </Dot>
            <Dot style={{ left: "31.4319%" }}>
              <span className="icon top">
                <FontAwesomeIcon icon="bus" size="1x" />
              </span>
            </Dot>
            <Dot style={{ left: "39.976%" }}>
              <span className="icon top">
                <FontAwesomeIcon icon="subway" size="1x" />
              </span>
            </Dot>
            <Dot style={{ left: "100%" }}>
              <span className="top">13:24</span>
            </Dot>
          </BarDots>
        </BarBar>
      </BarContainer>
    </PaddingBox>
  )
}

export default ItineraryStep
