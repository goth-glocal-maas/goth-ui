import React, { Component } from "react"
import styled from "styled-components"
import { Subscribe } from "unstated"
import { Query } from "react-apollo"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import PlanContainer from "../unstated/plan"
import { POI_SEARCH_QUERY } from "../constants/GraphQLCmd"
import Error from "./ErrorMessage"
import { black, gray } from "../constants/color"

const Input = styled.input`
  font-size: 1.6rem;
`

const BoxScrollOffset = styled.div`
  padding-right: 1rem;
  display: flex;
  flex-direction: column;

  h2 {
    font-size: 1.6rem;
    font-weight: bold;
    margin: 5px 0 2px;
  }
`

const ResultItem = styled.div`
  font-size: 1rem;
  color: ${black};
  svg {
    color: ${gray};
  }
  .title {
    color: ${black};
  }
  .card-content {
    padding: 1.2rem 1rem 0.5rem 1rem;
  }
`

class InputSearchBox extends Component {
  state = {
    query: ""
  }

  constructor(props) {
    super(props)
    this.textInput = React.createRef()
    // this.handleItemClick = this.handleItemClick.bind(this)
  }

  componentDidMount() {
    const { plan, destination } = this.props
    console.log(destination, plan.state[destination])
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.textInput.current.focus()
  }

  handleInputChange(e) {
    this.setState({ query: e.target.value.trim() })
  }

  goBack() {
    const { history } = this.props
    if (history.action === "POP") {
      history.push("/")
    } else {
      history.goBack()
    }
  }

  handleItemClick(item) {
    const { plan, destination } = this.props
    const {
      properties: { label },
      geometry: { coordinates }
    } = item
    if (destination === "from") {
      plan.setFromItem({ from: coordinates.reverse(), fromLabel: label })
    } else {
      plan.setToItem({ to: coordinates.reverse(), toLabel: label })
    }
    this.goBack()
  }

  renderSearchItem(item, index) {
    const {
      properties: { label, confidence, distance, source },
      geometry: { coordinates }
    } = item
    return (
      <ResultItem
        key={`result-item-${index}`}
        className="card"
        onClick={this.handleItemClick.bind(this, item)}
      >
        <div className="card-content">
          <p className="title">
            <FontAwesomeIcon icon="map-marked-alt" size="1x" /> {label}
          </p>
          <p className="subtitle">
            {coordinates[1]}, {coordinates[0]}
          </p>
        </div>
        {/* <footer className="card-footer">
          <p className="card-footer-item">
            <span>
              View on{" "}
              <a href="https://twitter.com/codinghorror/status/506010907021828096">
                Twitter
              </a>
            </span>
          </p>
          <p className="card-footer-item">
            <span>
              Share on <a href="#">Facebook</a>
            </span>
          </p>
        </footer> */}
      </ResultItem>
    )
  }

  render() {
    const {
      destination,
      plan: {
        state: { from, to }
      }
    } = this.props
    let searchParams = {
      text: this.state.query,
      province: "phuket"
    }
    return (
      <BoxScrollOffset>
        <div>
          <button className="button is-medium" onClick={this.goBack.bind(this)}>
            Back
          </button>
        </div>
        <h2>{destination === "from" ? "Origin" : "Destination"}</h2>
        <div />
        <Input
          className="input"
          type="text"
          ref={this.textInput}
          onChange={this.handleInputChange.bind(this)}
          placeholder="Search a place"
        />

        <Query
          query={POI_SEARCH_QUERY}
          variables={searchParams}
          skip={this.state.query.length < 1}
        >
          {({ loading, error, data }) => {
            if (loading) return <FontAwesomeIcon icon="cog" size="1x" spin />
            if (error) return <Error error={error} />
            if (!data) return <div>Start searching...</div>
            const { poi_search } = data
            if (poi_search.lengh < 1) return <div>Nothing found</div>
            return poi_search.map((ele, ind) => this.renderSearchItem(ele, ind))
          }}
        </Query>
      </BoxScrollOffset>
    )
  }
}

export default props => {
  return (
    <Subscribe to={[PlanContainer]}>
      {plan => <InputSearchBox {...props} plan={plan} />}
    </Subscribe>
  )
}
