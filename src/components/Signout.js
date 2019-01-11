import React  from "react"
import { Mutation } from "react-apollo"
import gql from "graphql-tag"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CURRENT_USER_QUERY } from "./User"

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signout {
      message
    }
  }
`

const Signout = props => (
  <Mutation
    mutation={SIGN_OUT_MUTATION}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {signout => <button onClick={signout}>
      <FontAwesomeIcon icon="sign-out-alt" />
      </button>}
  </Mutation>
)
export default Signout
