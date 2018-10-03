import React, { Component } from 'react'
import styled from 'styled-components'


const StyledUL = styled.ul`
z-index: 30;
position: fixed;
left: ${props => props.left ? props.left : 0}px;
top: ${props => props.top ? props.top : 0}px;
display: ${props => props.visible ? 'block' : 'none'};

border: 1px solid #ccc;
background: #fffffffe;

font-size: 0.85rem;
list-style: none;
`

const StyleItem = styled.li`
// border-bottom: 1px solid #ccc;
// margin: 0 0 1px 0;
padding: 1px 5px;
`


class ContextMenu extends Component {

  getCurrentLoc() {
    alert(this.props.coords)
  }

  render() {
    return (
      <StyledUL {...this.props}>
        <StyleItem><a onClick={this.getCurrentLoc.bind(this)}>Get Location</a></StyleItem>
        <StyleItem>Menu 2</StyleItem>
        <StyleItem>Menu 3</StyleItem>
      </StyledUL>
    )
  }
}

export default ContextMenu
