// import axios from 'axios'
// import _ from 'lodash'
// import store from '../store'
// import { failAuth, successAuth } from '../actions'
// import { URL, LOGIN } from '../constants/Api'

// export function InvalidCredentialsException(message) {
//     this.message = message
//     this.name = 'InvalidCredentialsException'
// }

// export function login(username, password) {
//   return axios
//     .post(URL + LOGIN, {
//       username,
//       password
//     })
//     .then(function (response) {
//       store.dispatch(successAuth(response.data))
//     })
//     .catch(function (error) {
//       store.dispatch(failAuth(error))
//       // raise different exception if due to invalid credentials
//       if (_.get(error, 'response.status') === 400) {
//         throw new InvalidCredentialsException(error)
//       }
//       throw error
//     })
// }
