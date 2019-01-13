import React, { Component } from "react"
import styled from "styled-components"
import { Subscribe } from "unstated"

import PlanContainer from "../unstated/plan"

const Input = styled.input`
  font-size: 1.6rem;
`

const BoxScrollOffset = styled.div`
  padding-right: 1rem;
  display: flex;
  flex-direction: column;
`

class InputSearchBox extends Component {
  goBack() {
    const { history } = this.props
    if (history.action === "POP") {
      history.push("/")
    } else {
      history.goBack()
    }
  }

  render() {
    return (
      <BoxScrollOffset>
        <button className="button is-medium" onClick={this.goBack.bind(this)}>
          Back
        </button>
        <Input className="input" type="text" />
      </BoxScrollOffset>
    )
  }
}

export default props => {
  return (
    <Subscribe to={[PlanContainer]}>
      {plan => <InputSearchBox {...props} plan={plan} />}
    </Subscribe>
  )
}
