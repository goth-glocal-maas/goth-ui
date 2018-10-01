import React from 'react'
// import './App.css'
import { Switch, Route } from 'react-router-dom'

import Header from './container/Header'
import Geo from './container/Geo'
import Gone from './container/Gone'

const App = () => (
  <div>
    {/* <Header /> */}
    <Switch>
      <Route exact path='/' component={Geo}/>
      {/* both /roster and /roster/:number begin with /roster */}
      <Route path='/roster/:id' component={Gone}/>
    </Switch>
  </div>
)

export default App
