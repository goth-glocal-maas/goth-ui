import React from "react"
import styled from "styled-components"
import { version, date } from "../../package.json"
import { gray } from "../constants/color"

const StyledFooter = styled.span`
  font-size: 1.2rem;
  color: ${gray};
`

const Footer = () => (
  <StyledFooter>
    v.{version}.{date}
    <br />
    <a
      href="https://goo.gl/forms/XVXIynnUCBFJe2My1"
      title="แบบสอบถามการใช้งาน GoTH"
      target="_blank"
    >
      แบบสอบถามการใช้งาน GoTH
    </a>
  </StyledFooter>
)

export default Footer
