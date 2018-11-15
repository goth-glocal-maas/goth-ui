import gql from 'graphql-tag'


export const ROUTEPLAN_QUERY = gql`
query ROUTEPLAN_QUERY($from: String!, $to: String!, $date: String!, $time: String!, $mode: String) {
  route_plan(
    from: $from
    to: $to
    date: $date
    time: $time
    mode: $mode
  ) {
    itineraries {
      startTime
      endTime
      transitTime
      walkTime
      waitingTime
      walkingDistance
      transfers
      legs {
        startTime
        endTime
        distance
        duration
        mode
      	from {
          lat
          lon
        }
      	to {
          lat
          lon
        }
        pathway
        departureDelay
        agencyId
        headsign
        tripId
        transitLeg
        routeType
        route
        routeColor
        routeTextColor
        realTime
        legGeometry {
          points
        }
        steps {
          distance
          relativeDirection
          streetName
        }
      }
    }
  }
}
`
