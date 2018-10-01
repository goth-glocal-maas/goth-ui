import {
  SET_TOKEN, REQUEST_LOGIN, SUCCESS_LOGIN, FAILED_LOGIN,
} from '../constants/ActionTypes'


const tokenInitialState = {
  token: null,
  fetching: false,
}
const token = (state = tokenInitialState, action) => {
  switch(action.type) {
    case REQUEST_LOGIN:
      return {
        token: null,
        fetching: true,
      }
    case SUCCESS_LOGIN:
      return {
        token: action.body.token,
        fetching: false,
      }
    case FAILED_LOGIN:
      return {
        token: null,
        fetching: false,
      }
    case SET_TOKEN:
      return {
        token: action.token,
        fetching: false,
      };
    default:
      return state;
  }
}

export default token

export const getToken = state => state.token
export const loggedIn = state => state && state.token !== null
