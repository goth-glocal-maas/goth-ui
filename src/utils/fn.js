import _ from "lodash"
import moment from "moment-timezone"

export const getHHMMFromSeconds = (secs) => {
  const hh = Math.floor(secs/3600)
  const mm = Math.floor(secs/60%60)
  return `${hh > 9 ? hh : `0${hh}`}:${mm > 9 ? mm : `0${mm}`}`
}

export const getCurrentTimeForPlan = tmsp => {
  let now = _.isNumber(tmsp) ? moment(+tmsp) : moment()
  now = now.tz("Asia/Bangkok")
  return {
    date: now.format("MM-DD-YYYY"),
    time: now.format("hh:mmA")
  }
}

export const getGoodTrips = (ities, mode = 0) => {
  // NOTE: filter out any transit trip longer than 300 min;
  //       it's not possible in Phuket anyway
  if (mode !== 0) return ities
  return ities.filter(i => (i.endTime - i.startTime) / 60 / 1000 < 301)
}

export const getHHMM = tmsp => {
  const mTmsp = _.isNumber(tmsp) ? moment(+tmsp) : moment()
  return mTmsp.tz("Asia/Bangkok").format("HH:mm")
}

export const getHH = tmsp => {
  const mTmsp = _.isNumber(tmsp) ? moment(+tmsp) : moment()
  return mTmsp.tz("Asia/Bangkok").format("HH")
}

export const getMM = tmsp => {
  const mTmsp = _.isNumber(tmsp) ? moment(+tmsp) : moment()
  return mTmsp.tz("Asia/Bangkok").format("mm")
}

export const sec2min = sec => (sec / 60).toFixed()
