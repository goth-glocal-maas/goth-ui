import React, { Component } from "react"
import styled from "styled-components"
import { toast } from "react-toastify"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import ODSearchBox from "./ODSearchBox"
import { red } from "../constants/color"
import { toastConf } from "../constants/toast"

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

class ODInput extends Component {
  handleSwitchOD() {
    const { origin, destination } = this.props
    this.props.swapOD({
      variables: { origin: destination, destination: origin }
    })
  }

  render() {
    const { origin, originLabel, destination, destinationLabel } = this.props
    const oneFilled =
      origin.length > 0 || destination.length > 0 ? "1" : undefined
    const thisToastConf = {
      ...toastConf,
      toastId: "menu-wip"
    }

    return (
      <ODBox>
        <ODInputBox>
          <ODSearchBox label="Origin" value={origin} valueLabel={originLabel} />
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
          <ODSearchBox
            label="Destination"
            value={destination}
            valueLabel={destinationLabel}
          />
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
