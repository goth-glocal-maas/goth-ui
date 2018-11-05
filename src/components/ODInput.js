import React, { Component, Fragment } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from 'react-router-dom'

import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

import "./ODInput.css"
import ODSearchBox from "./ODSearchBox"

const ODBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
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
  box-shadow: 1.5px 2.6px 10px 0 rgba(0, 0, 0, 0.2);

  width: 3.5rem;

  font-size: 1.6rem;
  margin: 1.4rem 0 0;
  padding: 0.3rem;

  color: #888;
  display: ${props => (props.visible ? "block" : 'none')};
`

const ODLink = styled(Link)`
  background: #ffffff;
  border: 0;
  border-radius: 1rem;
  box-shadow: 1.5px 2.6px 10px 0 rgba(0, 0, 0, 0.2);

  width: 3.5rem;

  font-size: 1.6rem;
  margin: 1.4rem 0 0;
  padding: 0.3rem;

  color: #888;
  display: ${props => (props.visible ? "block" : 'none')};
`

const coordsToStr = i => i.reverse().join(',');


class ODInput extends Component {

  handleSwitchOD() {
    const { origin, destination } = this.props
    this.props.swapOD({ variables: { origin: destination, destination: origin } })
  }

  handleGettingPlan() {

  }

  render() {
    const { origin, originLabel, destination, destinationLabel } = this.props
    const bothFilled = (origin.length > 0 && destination.length > 0) ? true : false
    const tsp = (new Date()).getTime()

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
              to={`/p/${coordsToStr(origin)}/${coordsToStr(destination)}?ts=${tsp}`}
              visible={bothFilled}>
              <FontAwesomeIcon icon="play-circle" size="lg" />
            </ODLink>
          </ODButtonBox>
        </ODInputBox>
      </ODBox>
    )
    //   <Query query={allDestinationInfo}>
    //   {({ loading, error, data: { destinationInfo } }) => {
    //     if (error) return <h1>Error...</h1>;
    //     if (loading || !destinationInfo) return <h1>Loading...</h1>;
    //     const { origin, originLabel, destination, destinationLabel } = destinationInfo
    //     return (
    //       <Fragment>
    //         <ODSearchBox
    //           label="Origin"
    //           value={origin}
    //           valueLabel={originLabel} />
    //         <ODSearchBox
    //           label="Destination"
    //           value={destination}
    //           valueLabel={destinationLabel} />
    //       </Fragment>
    //     )
    //   }}

    // </Query>

    // <Center className="input input--kyo">
    //   <input className="input__field input__field--kyo" type="text" id="input-19" />
    //   <label className="input__label input__label--kyo" htmlFor="input-19">
    //     <span className="input__label-content input__label-content--kyo">Where to?</span>
    //   </label>
    // </Center>
  }
}

const SWAP_OD = gql`
mutation updateDestinationInfo($origin: [Float], $destination: [Float]) {
  updateDestinationInfo(origin: $origin, destination: $destination) @client
}
`

export default compose(
  graphql(SWAP_OD, { name: 'swapOD' })
)(ODInput)

// export default ODInput
