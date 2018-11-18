import React from "react"
import styled from "styled-components"
import moment from "moment-timezone"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { yellow, grayBackground } from "../../constants/color"
import { TRANSPORT_MODES } from "../../constants/mode"
import ModeIcon from "./ModeIcon"
import { getHHMM } from "../../utils/fn";

const TagButton = styled.div`
  a {
    width: 30px;
    height: 30px;
    padding: 3px 3px;
    font-size: 1.1rem;
    box-shadow: 1px 1px 1px 0 rgba(0, 0, 0, 0.2);
  }
  a.is-link {
    color: #fff;
  }
  a.is-white {
    color: #888;
  }
  a.is-selected {
    background: ${yellow};
    color: black;
  }
  button {
    height: 30px;
    padding: 3px 3px;
    border: 0;
    border-radius: 10px;
    background: ${grayBackground};
    display: flex;
    align-items: center;
    color: #888;

    span {
      padding-top: 0.1rem;
      font-size: 1.3rem;
      margin: 0 0.2rem;
    }
  }
  button:hover {
    background: white;
    color: #222;
  }
`

const PanelModeSelector = props => (
  <TagButton className="field is-grouped is-grouped-multiline">
    {TRANSPORT_MODES.map((mode, i) => {
      return (
        <div className="control" key={`mode-sel-${mode}`}>
          <div className="tags has-addons">
            <a
              onClick={() => props.setMode(i)}
              className={`tag ${i === +props.mode ? "is-selected" : "is-white"}`}
            >
              <ModeIcon mode={mode} size="2x" />
            </a>
          </div>
        </div>
      )
    })}

    <div className="control">
      <div className="tags has-addons">
        <button className="" title={getHHMM(+props.timestamp)}>
          <FontAwesomeIcon icon={["far", "clock"]} size="2x" />
          <span>{getHHMM(+props.timestamp)}</span>
        </button>
      </div>
    </div>
  </TagButton>
)

export default PanelModeSelector