import { Container } from "unstated"
// import { Provider, Subscribe, Container } from 'unstated'

class PlanContainer extends Container {
  state = {
    from: [],  // latlon
    to: [],    // latlon
    timestamp: -1,
    picked: -1,
    itineraries: [],
    mode: 0,
    hash: ""
  }

  setItineraryResult = (from, to, timestamp, itineraries, hash) => {
    // reset picked in the process
    this.setState({ from, to, timestamp, itineraries, hash, picked: -1 })
  }

  setPickedItinerary = index => {
    // set new hash to force re-render PlanPolygonOverlay
    // const { hash } = this.state
    // const h = hash.split("P")[0]
    this.setState({ picked: index }) // , hash: `${h}P${index}` })
  }

  setItineraries = items => {
    this.setState({ itineraries: items })
  }

  setOD = ({ from, to }) => {
    this.setState({ from, to })
  }

  setFrom = from => {
    this.setState({ from })
  }

  setTo = to => {
    this.setState({ to })
  }

  setMode = mode => {
    this.setState({ mode })
  }

  setTimestamp = async timestamp => {
    await this.setState({ timestamp })
    return timestamp
  }
}

export default PlanContainer
