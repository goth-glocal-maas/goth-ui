import React, { Component, Fragment } from "react"
import { Popup } from "react-map-gl"
import styled from "styled-components"

const StyledUL = styled.ul`
  display: flex;
  flex-direction: row;
  font-size: 1.3rem;

  li {
    width: 10rem;
  }
`

export default class TapToMap extends Component {
  onHandleSetFrom() {
    const { lat, lon, onSetFrom, onCloseClick } = this.props
    onSetFrom([lat, lon])
    onCloseClick()
  }

  onHandleSetTo() {
    const { lat, lon, onSetTo, onCloseClick } = this.props
    onSetTo([lat, lon])
    onCloseClick()
  }

  render() {
    const { lat, lon, onCloseClick } = this.props

    if (!lat || !lon) return <Fragment />

    return (
      <Popup
        latitude={lat}
        longitude={lon}
        closeButton={true}
        closeOnClick={false}
        onClose={onCloseClick}
        anchor="bottom"
      >
        <div>Direction</div>
        <StyledUL>
          <li>
            <a onClick={this.onHandleSetFrom.bind(this)}>From here</a>
          </li>
          <li>
            <a onClick={this.onHandleSetTo.bind(this)}>To here</a>
          </li>
        </StyledUL>
      </Popup>
    )
  }
}

// ref: https://uber.github.io/react-map-gl/#/Documentation/api-reference/popup?section=properties
