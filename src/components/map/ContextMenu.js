import React, { Component } from 'react'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'


const StyledUL = styled.ul`
z-index: 2000;
position: fixed;
left: ${props => props.left ? props.left : 0}px;
top: ${props => props.top ? props.top : 0}px;
display: ${props => props.visible ? 'block' : 'none'};

border: 1px solid #ccc;
background: #fffffffe;

font-size: 1.6rem;
list-style: none;
`

const StyleItem = styled.li`
// border-bottom: 1px solid #ccc;
// margin: 0 0 1px 0;
padding: 1px 5px;
`


class ContextMenu extends Component {

  getCurrentLoc(where) {
    this.props.changeVisibility(false)
    const { coords } = this.props
    let variables = {}
    variables[where] = coords
    if (where === 'origin') {
      this.props.updateOrigin({ variables })
    } else if (where === 'destination') {
      this.props.updateDestination({ variables })
    }
  }

  render() {
    return (
      <StyledUL {...this.props}>
        <StyleItem>
          <a onClick={this.getCurrentLoc.bind(this, 'origin')}>
            From here
        </a>
        </StyleItem>
        <StyleItem>
          <a onClick={this.getCurrentLoc.bind(this, 'destination')}>
            To here
          </a>
        </StyleItem>
      </StyledUL>
    )
  }
}

const UPDATE_ORIGIN = gql`
  mutation updateDestinationInfo($origin: [Float]) {
    updateDestinationInfo(origin: $origin) @client
  }
`

const UPDATE_DESTINATION = gql`
  mutation updateDestinationInfo($destination: [Float]) {
    updateDestinationInfo(destination: $destination) @client
  }
`


export default compose(
  graphql(UPDATE_DESTINATION, {name: 'updateDestination'}),
  graphql(UPDATE_ORIGIN, {name: 'updateOrigin'})
)(ContextMenu)
