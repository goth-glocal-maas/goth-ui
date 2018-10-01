import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { getCounter } from '../reducers/first'
import { incFirstCounter } from '../actions'

const Main = (props) => (
  <div>
    Main

    <Link to={`/roster/12`}>12</Link>
    <p>Counter: { props.counter }</p>
    <p><button onClick={() => props.incFirstCounter() }>Increment</button></p>
  </div>
)


const mapStateToProps = state => ({
  counter: getCounter(state.first)
})
export default connect(
  mapStateToProps,
  { incFirstCounter }
)(Main)