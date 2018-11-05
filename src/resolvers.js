export const resolvers = {
  Mutation: {
    updateNetworkStatus: (_, { isConnected }, { cache }) => {
      const data = {
        networkStatus: {
          __typename: 'NetworkStatus',
          isConnected
        },
      }
      cache.writeData({ data })
      return { isConnected, __typename: 'NetworkStatus' }
    },
    updateDestinationInfo: (_, incoming, { cache }) => {
      const data = {
        destinationInfo: {
          ...incoming,
          __typename: 'DestinationInfo',
        },
      }
      cache.writeData({ data })
      return null
    },
    swapOD: (_, {origin, destination}, { cache }) => {
      console.log('mutate cache', cache)
      return null
    }
  }
}


export const defaults = {
  networkStatus: {
    __typename: 'NetworkStatus',
    isConnected: true
  },
  destinationInfo: {
    __typename: 'DestinationInfo',
    origin: [],
    originLabel: '',
    destination: [],
    destinationLabel: '',
  }
}


// export const typeDefs = `
// type Location {
//   coords: [Float]
//   label: String
// }

// type Query {
// }
// `
