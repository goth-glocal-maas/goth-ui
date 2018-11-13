import React from "react"
import styled from "styled-components"
import { Subscribe } from "unstated"

import PlanContainer from "../unstated/plan"
import ModeIcon from "./parts/ModeIcon"
import ItineraryStep from "./parts/ItineraryStep"

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
const MinBig = styled.span`
  font-size: 4rem;
`

const MinBox = styled.div`
  display: flex;
  width: 6rem;
`

const MinUnit = styled.span`
  float: right;
  font-size: 1.2rem
  color: #444;
  line-height: 1rem;
`

const CostUnit = styled.span`
  float: right;
  font-size: 1.5rem
  color: #444;
`

const ChioceItem = props => {
  return (
    <Subscribe to={[PlanContainer]}>
      {plan => (
        <ItineraryChoiceItem>
          <ItineraryStep />
          <Flex>
            <FlexCol>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "1.2rem" }}>
                  <ModeIcon size="2x" mode={"WALK"} key={`leg-icon-1`} />
                  <span>&nbsp;∘∘&nbsp;</span>
                  <ModeIcon size="2x" mode={"BUS"} key={`leg-icon-2`} />
                  <span>&nbsp;∘∘&nbsp;</span>
                  <ModeIcon size="2x" mode={"WALK"} key={`leg-icon-3`} />
                </div>
              </div>
            </FlexCol>
            <FlexCol>
              <MinBox>
                <MinBig>34</MinBig>
                <MinUnit>min</MinUnit>
              </MinBox>
              <MinBox>
                <CostUnit>50 THB</CostUnit>
              </MinBox>
            </FlexCol>
          </Flex>
        </ItineraryChoiceItem>
      )}
    </Subscribe>
  )
}

export default ChioceItem
