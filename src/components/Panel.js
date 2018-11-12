import React, { Component } from "react"
import styled from "styled-components"
import { Subscribe } from "unstated"

import PlanContainer from "../unstated/plan"
import { yellow, grayBackground } from "../constants/color"
import ODInput from './ODInput'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

  overflow-y: scroll;
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
              </TagButton>
              <ul>
                <li>Yeah1</li>
                <li>Yeah</li>
                <li>Yeah</li>
                <li>Yea2h</li>
                <li>Yea3h</li>
                <li>Yea4h</li>
                <li>Yeah1</li>
                <li>Yeah</li>
                <li>Yeah</li>
                <li>Yea2h</li>
                <li>Yea3h</li>
                <li>Yea4h</li>
                <li>Yeah1</li>
                <li>Yeah</li>
                <li>Yeah</li>
                <li>Yea2h</li>
                <li>Yea3h</li>
                <li>Yea4h</li>
                <li>Yeah1</li>
                <li>Yeah</li>
                <li>Yeah</li>
                <li>Yea2h</li>
                <li>Yea3h</li>
                <li>Yea4h</li>
                <li>Yeah1</li>
                <li>Yeah</li>
                <li>Yeah</li>
                <li>Yea2h</li>
                <li>Yea3h</li>
                <li>Yea4h</li>
              </ul>
            </BoxContent>
          </Box>
        )}
      </Subscribe>
    )
  }
}
