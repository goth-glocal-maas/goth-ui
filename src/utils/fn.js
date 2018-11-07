import _ from 'lodash'

export const getCurrentTimeForPlan = (init) => {
  const now = (_.isNaN(init) ? new Date() : new Date(+init))
  const hr = now.getHours()
  const min = now.getMinutes()
  const pm = hr > 12
  return {
    date: now.toISOString().slice(0, 10),
    time: (pm ? hr - 12 : hr) + ':' + min + (pm ? 'pm' : 'am')
  }
}
