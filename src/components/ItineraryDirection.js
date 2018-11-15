import React from "react"
import styled from "styled-components"
import { Subscribe } from "unstated"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import PlanContainer from "../unstated/plan"
import ModeIcon from "./parts/ModeIcon"
import { red, gray } from "../constants/color"
import ItineraryStep from "./parts/ItineraryStep"

const Card = styled.div`
  background: #fff;
  box-shadow: 1px 1px 1px 0 rgba(0, 0, 0, 0.2);
  padding: 1.3rem;
  border-radius: 0.5rem;

  margin: 0 0 1rem;
  transition: background-color 200ms ease;
`

const Timeline = styled.ul`
  list-style-type: none;
  margin: 2rem 0 0 0;
  padding: 0;
  position: relative;
  transition: all 0.5s linear;
  top: 0;

  :before {
    content: "";
    display: block;
    width: 0;
    height: 100%;
    border: 1px dashed ${gray};
    position: absolute;
    top: 0;
    left: 2rem;
  }
`

const Item = styled.li`
  margin: 0px 2rem 3rem;
  position: relative;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.3);
  color: #444;
  border-radius: 0.2rem;
  line-height: 2rem;
  font-size: 1.2rem;

  transition: background-color 200ms ease;

  :hover {
    background: #def0f0;
  }
`

const ItemLine = styled.span`
  content: "";
  display: block;
  width: 0;
  height: 100%;
  border: 1px solid ${red};
  position: absolute;
  top: 0;
  left: 0;

  :before {
    content: "";
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${red};
    border: 2px solid ${red};
    position: absolute;
    left: -0.5rem;
  }
  ${props =>
    props.hasEndDot &&
    `
  :after {
    content: "";
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${red};
    border: 2px solid ${red};
    position: absolute;
    left: -0.5rem;
  }
  `}

  :before {
    top: -1rem;
  }
  :after {
    top: 95%;
  }

  span:first-child {
    color: ${red};
    font-size: 1rem;
    font-weight: 200;
    position: absolute;
    top: -1.3rem;
    left: 1rem;
  }
  span:last-child {
    color: ${red};
    font-size: 1rem;
    font-weight: 200;
    position: absolute;
    bottom: -1.3rem;
    left: 1rem;
  }
`

const ItemPrice = styled.div``

const ItineraryDirection = props => {
  return (
    <Subscribe to={[PlanContainer]}>
      {plan => (
        <Card>
          <ItineraryStep />
          <Timeline>
            <Item>
              <ItemLine hasEndDot>
                <span>12:00</span>
                <span>12:05</span>
              </ItemLine>
              <div>
                <ModeIcon mode="WALK" size="1x" />
                &nbsp; 23 minutes
              </div>
              <ItemPrice>
                <FontAwesomeIcon icon={["far", "money-bill-alt"]} />
                &nbsp; 40 THB
              </ItemPrice>
            </Item>
            <Item>
              <ItemLine>
                <span>12:08</span>
              </ItemLine>
              <div className="info">
                the best animation , the best toturials you would ever see .
              </div>
            </Item>
            <Item>
              <ItemLine hasEndDot>
                <span>12:20</span>
                <span>12:34</span>
              </ItemLine>
              <div>
                <ModeIcon mode="BUS" size="1x" />
                &nbsp; 50 minutes
              </div>
              <div className="info">
                the best animation , the best toturials you would ever see .
              </div>
              <ItemPrice>
                <FontAwesomeIcon icon={["far", "money-bill-alt"]} />
                &nbsp; 40 THB
              </ItemPrice>
            </Item>
          </Timeline>
        </Card>
      )}
    </Subscribe>
  )
}

export default ItineraryDirection
