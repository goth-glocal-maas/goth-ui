import gql from "graphql-tag"

export const POI_SEARCH_QUERY = gql`
  query POI_SEARCH(
    $text: String!
    $lat: Float
    $lon: Float
    $province: String
  ) {
    poi_search(text: $text, lat: $lat, lon: $lon, province: $province) {
      type
      geometry {
        coordinates
      }
      properties {
        name
        label
        confidence
        layer
        source
        source_id
        distance
        accuracy
      }
    }
  }
`

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
        fare {
          details {
            regular {
              fareId
              routes
              price {
                cents
                currency {
                  currency
                  defaultFractionDigits
                  currencyCode
                }
              }
            }
          }
        }
        legs {
          startTime
          endTime
          distance
          duration
          mode
          from {
            lat
            lon
            name
            stopId
            stopSequence
          }
          to {
            lat
            lon
            name
            stopId
            stopSequence
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
