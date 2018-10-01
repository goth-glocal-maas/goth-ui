import {
  GEO_LOCATION_SUCCESS, GEO_LOCATION_FAILURE, GEO_LASTCENTER_UPDATE,
} from '../constants/ActionTypes'

const initialState = {
  timestamp: 0,
  coords: null,
  message: '',
  lastCenter: [13.84626739, 100.538],
  mapCenter: [13.84626739, 100.538],
  zoom: 13,
}

const geo = (state = initialState, action) => {
  switch (action.type) {
    case GEO_LOCATION_SUCCESS:
      /*
      action = {
        coords: {
          latitude: 13.8462448,
          longitude: 100.53825479999999,
          altitude: null,
          altitudeAccuracy: null,
          accuracy: 20,
          speed: 20,
        },
        timestamp: 1530214120419
      }
      */
      return {
        ...state,
        message: '',
        timestamp: action.timestamp,
        coords: {...action.coords},
      }
    case GEO_LOCATION_FAILURE:
      // action = {code: 3, message: "Timeout expired"}
      return {
        ...state,
        timestamp: 0,
        coords: null,
        message: action.message,
      }
    case GEO_LASTCENTER_UPDATE:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}

export default geo
