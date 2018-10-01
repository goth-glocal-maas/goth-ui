

import React, { Component } from 'react'

class Link extends Component {
  render() {
    const { id, properties: { english, thai } } = this.props.node
    return (
      <div>
        <div>
          {id} ({english} - {thai})
        </div>
      </div>
    )
  }

  _voteForLink = async () => {
    // ... you'll implement this in chapter 6
  }
}

export default Link
