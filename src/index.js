import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import registerServiceWorker from "./registerServiceWorker"
import { HashRouter } from "react-router-dom"
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "react-apollo"
import { Provider as UNSTATEDProvider } from "unstated"
import UNSTATED from "unstated-debug"
import { ToastContainer, Slide } from "react-toastify"

import "react-toastify/dist/ReactToastify.css"

import { defaults, resolvers } from "./resolvers"

import { GRAPHQL_URI } from "./constants/Api"

export const client = new ApolloClient({
  uri: GRAPHQL_URI,
  credentials: "include",
  clientState: {
    defaults,
    resolvers
  }
})

UNSTATED.logStateChanges = false

ReactDOM.render(
  <UNSTATEDProvider>
    <ApolloProvider client={client}>
      <HashRouter>
        <App />
      </HashRouter>
    </ApolloProvider>
    <ToastContainer transition={Slide} />
  </UNSTATEDProvider>,
  document.getElementById("root")
)

// ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
