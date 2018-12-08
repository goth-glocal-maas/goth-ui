import React from "react"
import styled from "styled-components"
import { Redirect } from "react-router-dom"
import Signup from "../components/Signup"
import Signin from "../components/Signin"
import RequestReset from "../components/RequestReset"
import User from "../components/User"

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`

const SignupPage = props => (
  <User>
    {({ data: { me } }) => {
      if (!me)
        return (
          <Columns>
            <Signup />
            <Signin />
            <RequestReset />
          </Columns>
        )
      return <Redirect to="/" />
    }}
  </User>
)

export default SignupPage
