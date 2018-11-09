import React from 'react'
import { Link } from 'react-router-dom'
import { getToken, loggedIn } from '../reducers/auth'
import { fetchAuth } from '../actions'
import LinkList from '../components/LinkList'

const Gone = (props) => (
  <div>
    Gone { props.match.params.id }

    <hr />
    <Link to={`/`}>Main</Link>

    <h1>LinkList</h1>

    <LinkList />
    <hr />
    {props.loggedIn ? 'Logged in': 'Nah anonymous'}
    <hr />

    <button onClick={_ => fetchAuth("user", "passwd")}>Login</button>
  </div>
)

export default Gone
