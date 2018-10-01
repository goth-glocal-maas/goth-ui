import React, { Component } from 'react'
import Link from './Link'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class LinkList extends Component {
  render() {
    const { loading, theaters } = this.props.theaterQuery
    console.log('theaters ---> ', theaters && theaters.edges.length)
    console.log('theaters ---> ', theaters && theaters.edges.map(t => t.node.id ))
    return (
      <div>
        { loading && 'loading' }
        { theaters && <p>{theaters.edges.length}</p> }
        { theaters && theaters.edges.map(t => <Link node={t.node} />) }
      </div>
    )
  }
}

const THEATER_QUERY = gql`
  query {
    theaters(english_Icontains: "terminal") {
      edges {
        node {
          id
          geometry {
            type
            coordinates
          }
          properties {
            english
            thai
            code
          }
        }
      }
    }
  }
`

export default graphql(THEATER_QUERY, { name: 'theaterQuery' }) (LinkList)
// export default LinkList
