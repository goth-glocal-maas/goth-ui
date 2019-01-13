import React from "react"
import styled from "styled-components"
import { version, date } from "../../package.json"
import { gray } from "../constants/color"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const StyledFooter = styled.span`
  font-size: 1.2rem;
  color: ${gray};

  a {
    color: ${gray};
  }
`

const Footer = () => (
  <StyledFooter>
    v.{version}.{date}
    &nbsp;&nbsp;
    <a href="javascript:location.reload(true)">
      <FontAwesomeIcon icon="sync" size="sm" />
    </a>
  </StyledFooter>
)

export default Footer
