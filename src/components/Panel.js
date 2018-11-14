import React, { Component } from "react"
import styled from "styled-components"
import { Subscribe } from "unstated"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import PlanContainer from "../unstated/plan"
import { yellow, grayBackground } from "../constants/color"
import ODInput from "./ODInput"
import ItineraryChoiceItem from "./ItineraryChoiceItem"
import ItineraryDirection from "./ItineraryDirection"

const Box = styled.div`
  width: 100%
  max-width: 360px;
  max-height: calc(100% - 10px); // 100vh;

  position: fixed;
  left: 5px;
  top: 5px;
  z-index: 3;  // mapbox logo on z-index 2

  // margin: 0.5rem;
  background: white;

  box-shadow: 1.5px 2px 2px 0 rgba(0,0,0,.2);
  display: flex;
  flex-direction: column;

  @media (max-width: 450px) {
    width: 98%;
    height: 50vh;

    top: 45vh;
    left: 5px;
    width: calc(100% - 10px);
    max-width: 450px;
    box-shadow: 1px 1px 3px rgba(0,0,0,.2);
  }
`

const BoxTitle = styled.div`
  width: 100%;
  background: ${yellow};

  padding: 0.5rem 1rem;
  font-size: 2rem;
`

const BoxContent = styled.div`
  padding: 0.5rem 0.5rem 0.5rem 1.5rem;
  background: ${grayBackground};

  overflow-y: auto;
`

const MutedHeader = styled.p`
  color: #888;
  font-size: 1.3rem;
`

const TagButton = styled.div`
  a {
    width: 30px;
    height: 30px;
    padding: 3px 3px;
    font-size: 1.1rem;
    box-shadow: 1px 1px 1px 0 rgba(0, 0, 0, 0.2);
  }
  a.is-link {
    color: #fff;
  }
  a.is-white {
    color: #888;
  }
  a.is-selected {
    background: ${yellow};
    color: black;
  }
  button {
    height: 30px;
    padding: 3px 3px;
    border: 0;
    border-radius: 10px;
    background: ${grayBackground};
    display: flex;
    align-items: center;
    color: #888;

    span {
      padding-top: 0.1rem;
      font-size: 1.3rem;
      margin: 0 0.2rem;
    }
  }
  button:hover {
    background: white;
    color: #222;
  }
`

const BoxScrollOffset = styled.div`
  padding-right: 1rem;
`


export default class Panel extends Component {
  render() {
    return (
      <Subscribe to={[PlanContainer]}>
        {plan => (
          <Box>
            <BoxTitle>GoTH</BoxTitle>
            <BoxContent>
              <ODInput origin={plan.state.from} destination={plan.state.to} />
              <TagButton className="field is-grouped is-grouped-multiline">
                <div className="control">
                  <div className="tags has-addons">
                    <a className="tag is-white">
                      <FontAwesomeIcon icon="bus" size="2x" />
                    </a>
                  </div>
                </div>

                <div className="control">
                  <div className="tags has-addons">
                    <a className="tag is-white">
                      <FontAwesomeIcon icon="walking" size="2x" />
                    </a>
                  </div>
                </div>

                <div className="control">
                  <div className="tags has-addons">
                    <a className="tag is-white">
                      <FontAwesomeIcon icon="bicycle" size="2x" />
                    </a>
                  </div>
                </div>

                <div className="control">
                  <div className="tags has-addons">
                    <a className="tag is-selected">
                      <FontAwesomeIcon icon="car" size="2x" />
                    </a>
                  </div>
                </div>

                <div className="control">
                  <div className="tags has-addons">
                    <button className="">
                      <FontAwesomeIcon icon={["far", "clock"]} size="2x" />
                      <span>Now</span>
                    </button>
                  </div>
                </div>
              </TagButton>

              <BoxScrollOffset>
                <MutedHeader>Recommended routes</MutedHeader>
                <ItineraryChoiceItem />
                <ItineraryDirection />
              </BoxScrollOffset>
            </BoxContent>
          </Box>
        )}
      </Subscribe>
    )
  }
}
