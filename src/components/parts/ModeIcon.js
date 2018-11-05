import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const iconConv = {
  WALK: 'walking',
  BICYCLE: 'bicycle',
  SUBWAY: 'subway',
  TAXI: 'taxi',
  CAR: 'car',
  BUS: 'bus',
  TRANSIT: 'bus',
}

const ModeIcon = (props) => {
  const iconName = iconConv[props.mode]
  if (iconName !== undefined)
    return <FontAwesomeIcon icon={iconName} size={props.size || "2x"} />

  return <i>{props.mode}</i>
}

export default ModeIcon
