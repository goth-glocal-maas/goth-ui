import { combineReducers } from 'redux'
import first from './first'
import auth from './auth'
import geo from './geo'

export default combineReducers({
  auth,
  geo,
  first,
})
