import { Container } from "unstated"
import moment from "moment-timezone"
// import { Provider, Subscribe, Container } from 'unstated'

class PlanContainer extends Container {
  state = {
    from: [], // latlon
    to: [], // latlon
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
    this.setState({ from, to, itineraries: [] })
  }

  setFrom = from => {
    this.setState({ from, itineraries: [] })
  }

  setTo = to => {
    this.setState({ to, itineraries: [] })
  }

  setMode = mode => {
    this.setState({ mode, itineraries: [] })
  }

  setTimestamp = timestamp => {
    this.setState({ timestamp })
  }

  setTime = timeDelta => {
    let { timestamp } = this.state
    let changed = false
    if (timestamp === -1) timestamp = new Date().getTime()
    let mnt = moment(timestamp).tz("Asia/Bangkok")
    if (timeDelta.add !== undefined) {
      const { key, delta } = timeDelta.add
      mnt = mnt.add(delta, key)
      changed = true
    } else {
      mnt = mnt.set(timeDelta)
      changed = true
    }
    if (changed) this.setState({ timestamp: +mnt.format("x") })
  }
}

export default PlanContainer
