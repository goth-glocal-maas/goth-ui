import React, { Component } from "react"
import styled from "styled-components"
import { yellow, grayBackground } from "../constants/color"

const Box = styled.div`
  width: 100%
  max-width: 360px;
  max-height: 100vh;

  position: fixed;
  left: 0;
  top: 30px;
  z-index: 3;  // mapbox logo on z-index 2

  // margin: 0.5rem;
  background: white;

  box-shadow: 1.5px 2.6px 10px 0 rgba(0,0,0,.2);
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
  padding: 1rem;
  background: ${grayBackground};

  overflow-y: scroll;
`

export default class Panel extends Component {
  render() {
    return (
      <Box>
        <BoxTitle>GoTH</BoxTitle>
        <BoxContent>
          <ul>
            <li>Yeah1</li>
            <li>Yeah</li>
            <li>Yeah</li>
            <li>Yea2h</li>
            <li>Yea3h</li>
            <li>Yea4h</li>
          </ul>
        </BoxContent>
      </Box>
    )
  }
}
