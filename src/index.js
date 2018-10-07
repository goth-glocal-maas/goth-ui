import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { HashRouter } from 'react-router-dom'

import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import store from './store'

import ApolloClient from "apollo-boost"
import { ApolloProvider } from 'react-apollo'
// import { InMemoryCache } from 'apollo-cache-inmemory'
// import { withClientState } from 'apollo-link-state'

import { defaults, resolvers } from './resolvers'

import { GRAPHQL_URI } from './constants/Api'


// const cache = new InMemoryCache();
// const stateLink = withClientState({ cache, resolvers, defaults });

export const client = new ApolloClient({
  uri: GRAPHQL_URI,
  clientState: {
    defaults,
    resolvers,
  }
})

const persistor = persistStore(store)

ReactDOM.render((
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ApolloProvider client={client}>
        <HashRouter>
          <App />
        </HashRouter>
      </ApolloProvider>
    </PersistGate>
  </Provider>
), document.getElementById('root'))

// ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
