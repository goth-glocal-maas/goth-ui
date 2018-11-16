import _ from "lodash"

export const getCurrentTimeForPlan = init => {
  const now = _.isNaN(init) ? new Date() : new Date(+init)
  const hr = now.getHours()
  const min = now.getMinutes()
  const pm = hr > 11
  return {
    date: now.toISOString().slice(0, 10),
    time: (pm ? hr - 12 : hr) + ":" + min + (pm ? "pm" : "am")
  }
}

export const getGoodTrips = (ities, mode=0) => {
  // NOTE: filter out any transit trip longer than 300 min;
  //       it's not possible in Phuket anyway
  if (mode !== 0) return ities
  return ities.filter(i => (i.endTime - i.startTime) / 60 / 1000 < 301)
}

export const getHHMM = tmsp => {
  const d = new Date(tmsp)
  const hh = d.getHours()
  const mm = d.getMinutes()
  return `${hh < 10 ? `0${hh}` : hh}:${mm < 10 ? `0${mm}` : mm}`
}

export const sec2min = sec => (sec/60).toFixed()
