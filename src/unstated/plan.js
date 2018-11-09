import { Container } from 'unstated'
// import { Provider, Subscribe, Container } from 'unstated'


class PlanContainer extends Container {
  state = {
    from: [],
    to: [],
    timestamp: -1,
    picked: 0,
    itineraries: [],
    hash: '',
  }

  setItineraryResult = (from, to, timestamp, itineraries, hash) => {
    this.setState({ from, to , timestamp, itineraries, hash })
  }

  setPickedItinerary = (index) => {
    // set new hash to force re-render PlanPolygonOverlay
    const { hash } = this.state
    const h = hash.split('P')[0]
    this.setState({ picked: index, hash: `${h}P${index}` })
  }

  setItineraries = (items) => {
    console.log('container - items: ', items)
    this.setState({ itineraries: items })
  }

  setFrom = (from) => {
    this.setState({ from })
  }

  setTo = (to) => {
    this.setState({ to })
  }

  setTimestamp = (timestamp) => {
    this.setState({ timestamp })
  }

}

export default PlanContainer
