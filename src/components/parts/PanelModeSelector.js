import React from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ReactGA from "react-ga"

import { yellow } from "../../constants/color"
import { TRANSPORT_MODES } from "../../constants/mode"
import ModeIcon from "./ModeIcon"
import { getHH, getMM } from "../../utils/fn"
import TimePicker from "./TimePicker"

const TagButton = styled.div`
  button {
    width: 30px;
    height: 30px;
    padding: 3px 3px;
    font-size: 1.1rem;
    box-shadow: 1px 1px 1px 0 rgba(0, 0, 0, 0.2);
    border: 0;
  }
  button.is-link {
    color: #fff;
  }
  button.is-white {
    color: #888;
  }
  button.is-selected {
    background: ${yellow};
    color: black;
  }
  button:focus {
    outline: none;
  }
`

const TagWithAddon = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
`

const PanelModeSelector = props => (
  <TagButton className="field is-grouped is-grouped-multiline">
    {TRANSPORT_MODES.map((mode, i) => {
      return (
        <div className="control" key={`mode-sel-${mode}`}>
          <div className="tags has-addons">
            <button
              onClick={() => {
                ReactGA.event({
                  category: "Transport",
                  action: "set mode",
                  value: i,
                  label: mode
                })
                props.setMode(i)
              }}
              className={`tag ${
                i === +props.mode ? "is-selected" : "is-white"
              }`}
            >
              <ModeIcon mode={mode} size="2x" />
            </button>
          </div>
        </div>
      )
    })}

    <div className="control">
      <TagWithAddon className="tags has-addons">
        <FontAwesomeIcon icon={["far", "clock"]} size="2x" />
        <TimePicker
          changeTime={timeDelta => {
            props.setTime(timeDelta)
          }}
          initHours={getHH(props.timestamp)}
          initMin={getMM(props.timestamp)}
        />
      </TagWithAddon>
    </div>
  </TagButton>
)

export default PanelModeSelector
