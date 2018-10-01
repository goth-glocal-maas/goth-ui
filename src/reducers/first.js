import {
  FIRST_INCREMENT_COUNTER, FIRST_ASSIGN_ID
} from '../constants/ActionTypes'

const initialState = {
  counter: 1,
  id: {}
}

const first = (state = initialState, action) => {
  switch (action.type) {
    case FIRST_INCREMENT_COUNTER:
      return {
        ...state,
        counter: state.counter +1
      }
      case FIRST_ASSIGN_ID:
        return {
          ...state,
          id: action.newId
        }
    default:
      return {
        counter: 1,
        id: {}
      }
  }
}

export default first


export const getCounter = state => state.counter
export const getId = state => state.id