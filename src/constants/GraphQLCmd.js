import gql from "graphql-tag"

export const AVAILABLE_STOPS_QUERY = gql`
  query STOPS(
    $minLat: Float!
    $minLon: Float!
    $maxLat: Float!
    $maxLon: Float!
  ) {
    stops(
      min_lat: $minLat
      min_lon: $minLon
      max_lat: $maxLat
      max_lon: $maxLon
    ) {
      id
      name
      lat
      lon
    }
  }
`

export const STOP_INFO_QUERY = gql`
  query STOP_TABLE($stopId: String!) {
    stop_detail(stop_id: $stopId) {
      id
      name
      desc
      lat
      lon
    }
    stop_route(stop_id: $stopId) {
      shortName
      longName
      mode
      color
      agencyName
    }
    stop_stoptimes(stop_id: $stopId) {
      pattern {
        id
        desc
      }
      times {
        scheduledArrival
        headsign
        tripId
        stopCount
      }
    }
  }
`

export const ROUTEPLAN_QUERY = gql`
  query ROUTEPLAN_QUERY(
    $from: String!
    $to: String!
    $date: String!
    $time: String!
    $mode: String
  ) {
    route_plan(from: $from, to: $to, date: $date, time: $time, mode: $mode) {
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
