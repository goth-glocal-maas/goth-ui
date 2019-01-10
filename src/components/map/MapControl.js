import React, { Component } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const FollowMyLocation = styled.div`
width: 40px
height: 40px;
background: #fefefebb;
border-radius: 10px;
color: #209cee;
position: fixed;
text-align: center;
padding-top: 10px;
right: 0;
bottom: 100px;
z-index: 30;
display: block;
`

class MapControl extends Component {
  render() {
    return (
      <FollowMyLocation onClick={this.props.moveToCurrentLoc}>
        <FontAwesomeIcon icon={["far", "dot-circle"]} size="1x" />
      </FollowMyLocation>
    )
  }
}

MapControl.propTypes = {
  moveToCurrentLoc: PropTypes.func.isRequired
}

export default MapControl
