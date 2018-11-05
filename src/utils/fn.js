import _ from 'lodash'


export const getCurrentTimeForPlan = (init) => {
  const now = (_.isNaN(init) ? new Date() : new Date(+init))
  return {
    date: now.toISOString().slice(0, 11),
    time: now.toLocaleTimeString(),
  }
}
