import React, { Component } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"

// import "./ODInput.css"
import ODSearchBox from "./ODSearchBox"

const ODBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
`

const ODInputBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`

const ODButtonBox = styled.div`
  width: 4rem;
  height: 100%;
  text-align: center;
`

const ODButton = styled.button`
  background: #ffffff;
  border: 0;
  border-radius: 1rem;
  box-shadow: 1.5px 1px 1px 0 rgba(0, 0, 0, 0.2);

  width: 3.5rem;

  font-size: 1.6rem;
  margin: 0.5rem 0 0;
  padding: 0.3rem;

  color: #888;
  display: ${props => (props.visible ? "block" : "none")};
`

const ODLink = styled(Link)`
  background: #ffffff;
  border: 0;
  border-radius: 1rem;
  box-shadow: 1.5px 1px 1px 0 rgba(0, 0, 0, 0.2);

  width: 3.5rem;

  font-size: 1.6rem;
  margin: 0.5rem 0 0;
  padding: 0.3rem;

  color: #888;
  display: ${props => (props.visible ? "block" : "none")};
`

const coordsToStr = i => i.reverse().join(",")

class ODInput extends Component {
  handleSwitchOD() {
    const { origin, destination } = this.props
    this.props.swapOD({
      variables: { origin: destination, destination: origin }
    })
  }

  render() {
    const { origin, originLabel, destination, destinationLabel } = this.props
    const bothFilled =
      (origin.length > 0 && destination.length > 0) ? true : undefined
    const tsp = new Date().getTime()
    return (
      <ODBox>
        <ODInputBox>
          <ODSearchBox label="Origin" value={origin} valueLabel={originLabel} />
          <ODButtonBox>
            <ODButton
              visible={bothFilled}
              onClick={this.handleSwitchOD.bind(this)}
            >
              <FontAwesomeIcon icon="sync" size="sm" />
            </ODButton>
          </ODButtonBox>
        </ODInputBox>
        <ODInputBox>
          <ODSearchBox
            label="Destination"
            value={destination}
            valueLabel={destinationLabel}
          />
          <ODButtonBox>
            <ODLink
              to={`/p/${coordsToStr(origin)}/${coordsToStr(
                destination
              )}?ts=${tsp}`}
              visible={bothFilled}
            >
              <FontAwesomeIcon icon="play-circle" size="lg" />
            </ODLink>
          </ODButtonBox>
        </ODInputBox>
      </ODBox>
    )
  }
}

export default ODInput
