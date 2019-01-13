import React, { Component } from "react"
import styled from "styled-components"
import { Subscribe } from "unstated"
import ReactGA from "react-ga"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import PlanContainer from "../unstated/plan"
import ModeIcon from "./parts/ModeIcon"
import { red, gray, black } from "../constants/color"
import { getHHMM, sec2min } from "../utils/fn"


// TODO: Fix overflow problem, no scroll..
const Card = styled.div`
  background: #fff;
  box-shadow: 1px 1px 1px 0 rgba(0, 0, 0, 0.2);
  padding: 1.3rem;
  border-radius: 0.5rem;

  margin: 0.4rem 0 0;
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
  border: 1px solid ${props => props.color};
  position: absolute;
  top: 0;
  left: 0;

  :before {
    content: "";
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${props => props.color};
    border: 2px solid ${props => props.color};
    position: absolute;
    left: -0.5rem;
  }

  :after {
    content: "";
    display: ${props => (props.hasEndDot ? "block" : "none")};
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${props => props.color};
    border: 2px solid ${props => props.color};
    position: absolute;
    left: -0.5rem;
  }

  :before {
    top: -1rem;
  }
  :after {
    top: 95%;
  }

  span:first-child {
    color: ${black};
    font-size: 1.2rem;
    font-weight: 200;
    position: absolute;
    top: -1.3rem;
    left: 1rem;
  }
  span:last-child {
    color: ${black};
    font-size: 1.2rem;
    font-weight: 200;
    position: absolute;
    bottom: -1.3rem;
    left: 1rem;
  }
`

const ItemPrice = styled.div``

class ItineraryDirection extends Component {
  componentDidMount() {
    ReactGA.event({
      category: "Transport",
      action: "view direction"
    })
  }

  renderStop = stop => (
    <div>
      <FontAwesomeIcon icon="map-marker-alt" size="1x" /> {stop}
    </div>
  )

  render() {
    const { trip } = this.props

    return (
      <Subscribe to={[PlanContainer]}>
        {plan => (
          <Card>
            <Timeline>
              {trip.legs.map((leg, index) => (
                <Item key={`picked-trip-item-${index}`}>
                  <ItemLine
                    color={leg.routeColor ? `#${leg.routeColor}` : red}
                    hasEndDot
                  >
                    <span>{getHHMM(leg.startTime)}</span>
                    <span>{getHHMM(leg.endTime)}</span>
                  </ItemLine>
                  {leg.mode !== "WALK" && this.renderStop(`${leg.from.name}`)}
                  <div
                    style={{
                      color: leg.routeColor ? `#${leg.routeColor}` : black
                    }}
                  >
                    <div>
                      <ModeIcon mode={leg.mode} size="2x" />
                      {leg.agencyId && (
                        <React.Fragment>
                          &nbsp;
                          <span className="tag is-light is-medium">
                            {leg.agencyId}
                          </span>
                        </React.Fragment>
                      )}
                    </div>
                    <div>
                      {leg.route}
                      {leg.headsign && (
                        <React.Fragment>&nbsp;→ {leg.headsign}</React.Fragment>
                      )}
                    </div>
                    {sec2min(leg.duration)} minutes
                  </div>
                  {leg.mode === "BUS" && (
                    <ItemPrice>
                      <span className="tag is-warning">BUY TICKET SOON</span>
                      {/* <FontAwesomeIcon icon={["far", "money-bill-alt"]} />
                        &nbsp; 15 THB */}
                    </ItemPrice>
                  )}
                  {leg.mode !== "WALK" && this.renderStop(`${leg.to.name}`)}
                </Item>
              ))}
            </Timeline>
          </Card>
        )}
      </Subscribe>
    )
  }
}

export default ItineraryDirection
