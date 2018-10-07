import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

import './ODInput.css'
import ODSearchBox from './ODSearchBox'

const Center = styled.span`
text-align: center;
`

const NETWORKSTATUS = gql`
  query NETWORKSTATUS {
    networkStatus @client {
      isConnected
    }
  }
`

const allDestinationInfo = gql`
  query allDestinationInfo {
    destinationInfo @client {
      origin
      originLabel
      destination
      destinationLabel
    }
  }
`

class ODInput extends Component {

  render() {
    return (
      <Fragment>
        <Query query={allDestinationInfo}>
            {({ loading, error, data: { destinationInfo } }) => {
              if (error) return <h1>Error...</h1>;
              if (loading || !destinationInfo) return <h1>Loading...</h1>;
              const { destination, destinationLabel } = destinationInfo
              return (
                <Fragment>
                  <ODSearchBox
                    label="destination"
                    value={destination}
                    valueLabel={destinationLabel} />
                </Fragment>
              )
            }}

        </Query>

        <Center className="input input--kyo">
          <input className="input__field input__field--kyo" type="text" id="input-19" />
          <label className="input__label input__label--kyo" htmlFor="input-19">
            <span className="input__label-content input__label-content--kyo">Where to?</span>
          </label>
        </Center>

      </Fragment>
    )
  }
}


export default ODInput
