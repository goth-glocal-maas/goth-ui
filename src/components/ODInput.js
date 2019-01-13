import React, { Component } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import ODSearchBox from "./ODSearchBox"
import { red } from "../constants/color"
import { toastConf } from "../constants/toast"

const ODBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin-bottom: 4px;
`

const ODInputBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`

const ODButtonBox = styled.div`
  width: 4rem;
  height: 4rem;
  justify-content: center;
  align-items: center;
  display: ${props => (props.visible ? "inline-flex" : "none")};
  font-size: 1.6rem;

  :hover {
    color: ${red};
    cursor: pointer;
  }
`

const ButtonContainer = styled.button`
  border: 0;
  padding: 0;
  margin: 3px 0;
  background: rgb(255, 255, 255);
  border-radius: 0.5rem;
  box-shadow: rgba(0, 0, 0, 0.2) 1.5px 1px 1px 0px;
  width: 100%;

  input {
    width: 100%;
    padding: 0.85rem 1rem;
    font-weight: bold;
    border: 0;
    border-radius: 0.5rem;
    background: transparent;
    color: rgb(44, 44, 44);
    font-size: 1.6rem;
  }

  input:focus {
    outline: none;
  }
`

class ODInput extends Component {
  handleSwitchOD() {
    const { origin, destination } = this.props
    this.props.swapOD({
      variables: { origin: destination, destination: origin }
    })
  }

  goToSearch(destination) {
    const { history } = this.props
    history.push(`/search/${destination}`)
  }

  render() {
    const { origin, originLabel, destination, destinationLabel } = this.props
    const oneFilled =
      origin.length > 0 || destination.length > 0 ? "1" : undefined
    const thisToastConf = {
      ...toastConf,
      toastId: "menu-wip"
    }
    /* TODO: somehow `origin` shows in <input /> should translate by geocoder
             for both __from__ and __to__
    */
    return (
      <ODBox>
        <ODInputBox>
          <ButtonContainer onClick={this.goToSearch.bind(this, "from")}>
            <input type="text" value={origin} placeholder="Origin" />
          </ButtonContainer>
          <ODButtonBox
            visible={true}
            onClick={() => {
              if (!toast.isActive("menu-wip"))
                toast.error("This feature is under-development", thisToastConf)
            }}
          >
            <FontAwesomeIcon icon="ellipsis-v" size="1x" />
          </ODButtonBox>
        </ODInputBox>
        <ODInputBox>
          <ButtonContainer onClick={this.goToSearch.bind(this, "to")}>
            <input type="text" value={destination} placeholder="Destination" />
          </ButtonContainer>
          <ODButtonBox
            visible={oneFilled}
            onClick={() => this.props.switchOD()}
          >
            <FontAwesomeIcon icon="sync" size="1x" />
          </ODButtonBox>
        </ODInputBox>
      </ODBox>
    )
  }
}

export default ODInput
