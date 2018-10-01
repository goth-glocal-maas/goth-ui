import * as types from '../constants/ActionTypes'
import { login } from '../utils/Auth'

export const incFirstCounter = _ => ({
  type: types.FIRST_INCREMENT_COUNTER,
})

export const assignFirstId = objId => ({
  type: types.FIRST_ASSIGN_ID,
  newId: objId
})

// auth
export const reqAuth = _ => {
  return {
    type: types.REQUEST_LOGIN,
  }
}

export const successAuth = (body) => {
  return {
    type: types.SUCCESS_LOGIN,
    body
  }
}

export const failAuth = (body) => {
  return {
    type: types.FAILED_LOGIN,
    body
  }
}

export function fetchAuth(user, passwd) {
  return (dispatch) => {
    dispatch(reqAuth())
    return login(user, passwd)
  }
}

// token
export const setToken = (data) => {
  return {
    type: types.SET_TOKEN,
    token: data,
  }
}


// geo

export const geoLocationUpdate = (position) => {
  /*
    Position {coords: Coordinates, timestamp: 1530214120419}
    Coordinates {
      latitude: 13.8462448, longitude: 100.53825479999999,
      altitude: null, accuracy: 20,
      altitudeAccuracy: null, speed: 20}
  */
  const { coords } = position
  const newCoords = {
    accuracy: coords.accuracy,
    altitude: coords.altitude,
    altitudeAccuracy: coords.altitudeAccuracy,
    heading: coords.heading,
    latitude: coords.latitude,
    longitude: coords.longitude,
    speed: coords.speed,
  }
  return {
    type: types.GEO_LOCATION_SUCCESS,
    coords: newCoords,
    timestamp: position.timestamp,
  }
}

export const geoLocationFailed = (positionErr) => {
  // PositionError {code: 3, message: "Timeout expired"}
  return {
    type: types.GEO_LOCATION_FAILURE,
    code: positionErr.code,
    message: positionErr.message,
  }
}


export const lastCenterUpdate = (lat, lon, zoom) => {
  // this only update current map center from map movement alone
  let payload = {
    lastCenter: [lat, lon]
  }
  if (zoom !== undefined)
    payload['zoom'] = zoom
  return {
    type: types.GEO_LASTCENTER_UPDATE,
    payload,
  }
}
