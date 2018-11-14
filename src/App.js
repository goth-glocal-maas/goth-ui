import React from "react"
// import './App.css'
import { Switch, Route } from "react-router-dom"
import { library } from "@fortawesome/fontawesome-svg-core"
import {
  faWalking,
  faBus,
  faSubway,
  faMotorcycle,
  faBicycle,
  faTaxi,
  faShuttleVan,
  faCar,
  faEllipsisH,
  faSync,
  faPlayCircle,
  faCog,
  faEllipsisV
} from "@fortawesome/free-solid-svg-icons"
import {
  faClock as farFaClock,
  faMoneyBillAlt as farFaMoneyBillAlt
} from "@fortawesome/free-regular-svg-icons"

import Header from "./container/Header"
import Geo from "./container/Geo"
import Map from "./container/Map"
import Gone from "./container/Gone"

library.add(faWalking)
library.add(faBus)
library.add(faSubway)
library.add(faMotorcycle)
library.add(faBicycle)
library.add(faTaxi)
library.add(faShuttleVan)
library.add(faCar)
library.add(faEllipsisH)
library.add(faSync)
library.add(faPlayCircle)
library.add(faCog)
library.add(faEllipsisV)

library.add(farFaClock)
library.add(farFaMoneyBillAlt)

const App = () => (
  <div>
    {/* <Header /> */}
    <Switch>
      <Route path="/old" component={Geo} />
      <Route path="/" component={Map} />
      {/* both /roster and /roster/:number begin with /roster */}
      {/* <Route path="/roster/:id" component={Gone} /> */}
    </Switch>
  </div>
)

export default App
