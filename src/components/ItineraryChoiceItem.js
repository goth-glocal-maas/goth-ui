import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { Subscribe } from "unstated"

import { black } from "../constants/color"
import PlanContainer from "../unstated/plan"
import ItineraryStep from "./parts/ItineraryStep"
import { add } from "../utils/fn"

const ItineraryChoiceItem = styled.div`
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

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`

const FlexCol = styled.div``

const FlexColCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const MinBig = styled.span`
  font-size: 4rem;
`

const MinBox = styled.div`
  display: flex;
`

const MinUnit = styled.span`
  float: right;
  font-size: 1.2rem
  color: ${black};
  line-height: 1rem;
`

const CostUnit = styled.span`
  float: right;
  font-size: 1.5rem
  color: ${black};
`

const IndexesBox = styled.div`
  display: flex;
`

const IndexOne = styled.div`
  min-width: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const IndexLabel = styled.div`
  font-size: 1rem;
`

const IndexValue = styled.div`
  font-size: 3.5rem;
  line-height: 3rem;
  text-align: center;
`

const ChioceItem = props => {
  const { minStartTime, maxEndTime } = props
  const { startTime, endTime, fare } = props.itinerary
  let farePrice = null
  if (fare && fare.details.regular) {
    const { regular } = fare.details
    const fraction = Math.pow(
      10,
      regular[0].price.currency.defaultFractionDigits
    )
    const totalFare = regular.map(i => i.price.cents).reduce(add)
    farePrice = totalFare / fraction
  }
  const durationMin = (endTime - startTime) / 60 / 1000
  const percentPerSec = 100 / (maxEndTime - minStartTime)
  const maxPercent =
    maxEndTime === endTime
      ? 100
      : (endTime - minStartTime) * percentPerSec
  return (
    <Subscribe to={[PlanContainer]}>
      {plan => (
        <ItineraryChoiceItem
          onClick={() => {
            plan.setPickedItinerary(props.index)
          }}
        >
          <ItineraryStep
            {...props}
            maxPercent={maxPercent}
            percentPerSec={percentPerSec}
          />
          <Flex>
            <FlexColCenter>
              {/* <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "1.2rem" }}>
                  <ModeIcon size="2x" mode={"WALK"} key={`leg-icon-1`} />
                  <span>&nbsp;∘∘&nbsp;</span>
                  <ModeIcon size="2x" mode={"BUS"} key={`leg-icon-2`} />
                  <span>&nbsp;∘∘&nbsp;</span>
                  <ModeIcon size="2x" mode={"WALK"} key={`leg-icon-3`} />
                </div>
              </div> */}
              <IndexesBox>
                <IndexOne>
                  <IndexLabel>SAFETY</IndexLabel>
                  <IndexValue>
                    <span className="tag is-warning">SOON</span>
                  </IndexValue>
                </IndexOne>
                <IndexOne>
                  <IndexLabel>WALKABILITY</IndexLabel>
                  <IndexValue>
                    <span className="tag is-warning">SOON</span>
                  </IndexValue>
                </IndexOne>
              </IndexesBox>
            </FlexColCenter>
            <FlexCol>
              <MinBox>
                <MinBig>{durationMin.toFixed(0)}</MinBig>
                <MinUnit>min</MinUnit>
              </MinBox>
              <MinBox>
                <CostUnit>{farePrice} THB</CostUnit>
              </MinBox>
            </FlexCol>
          </Flex>
        </ItineraryChoiceItem>
      )}
    </Subscribe>
  )
}

ChioceItem.propTypes = {
  index: PropTypes.number.isRequired,
  minStartTime: PropTypes.number.isRequired,
  maxEndTime: PropTypes.number.isRequired,
  itinerary: PropTypes.object.isRequired // shape is too complicated for this
}

export default ChioceItem
