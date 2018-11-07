import React, { Component, Fragment } from "react"
import styled from "styled-components"
import ModeIcon from "./parts/ModeIcon"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Container = styled.div`
  background: #fff;
  border-radius: 1rem;
  padding: 1rem 2rem;
  margin: 0.5rem;

  display: flex;
`

const One = styled.div`
  flex: 1;
`

const MinUnit = styled.span`
  float: right;
  font-size: 1.2rem
  color: #444;
  line-height: 1rem;
`

const MinBig = styled.span`
  font-size: 4rem;
`

const MinBox = styled.div`
  width: 6rem;
`

export default class ItineraryChoiceItem extends Component {
  renderLegMode(legs) {
    const modes = Object.keys(legs).map(i => (
      <ModeIcon mode={legs[i].mode} key={`leg-icon-${i}`} />
    ))
    // let ms = modes.join(<FontAwesomeIcon icon="ellipsis-h" />)
    return <Fragment>{modes}</Fragment>
  }

  render() {
    const { startTime, endTime, legs, transfers } = this.props
    const duration = endTime - startTime
    const durationMin = duration / 1000 / 60
    return (
      <Container>
        <One>
          {this.renderLegMode(legs)}
          <br />
          {transfers > 0 && `Transfer: ${transfers}`}
        </One>
        <MinBox>
          <MinUnit>min</MinUnit>
          <MinBig>{durationMin.toFixed()}</MinBig>
        </MinBox>
      </Container>
    )
  }
}
