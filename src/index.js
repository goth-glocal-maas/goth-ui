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

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { GRAPHQL_URI } from './constants/Api'

const httpLink = new HttpLink({ uri: GRAPHQL_URI })

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
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
