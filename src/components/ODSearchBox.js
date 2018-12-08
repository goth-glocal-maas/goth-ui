import React, { Component } from 'react'
import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import _ from 'lodash'

const theme = {
  container: {
    position: 'relative',
    display: 'inline-block',
    fontSize: '1.6rem',
    margin: '0.5rem 0.5rem 0.5rem 0rem',
    width: 'calc(100% - 4rem)',
    verticalAlign: 'top',

    padding: 0,
    borderRadius: '0.5rem',
    background: 'transparent',
    border: 0,
    color: 'transparent',
    boxShadow: '1.5px 1px 1px 0 rgba(0, 0, 0, 0.2)',
  },
  input: {
    position: 'relative',
    display: 'block',
    float: 'right',
    border: 0,
    fontWeight: 'bold',
    padding: '0.85rem 1.5rem',
    width: '100%',
    borderRadius: '0.5rem',
    background: '#fff',
    color: '#2c2c2c',
    zIndex: 4,
  },
  inputFocused: {
    zIndex: 40,
    color: '#000',
    opacity: 1
  },
  inputOpen: {
    // borderBottomLeftRadius: 0,
    // borderBottomRightRadius: 0
  },
  suggestionsContainer: {
    display: 'none'
  },
  suggestionsContainerOpen: {
    zIndex: 50,
    display: 'block',
    position: 'absolute',
    top: '3.2rem',
    width: '100%',
    border: 0, // '1px solid #aaa',
    backgroundColor: '#fff',
    fontWeight: 300,
    borderBottomLeftRadius: '2rem',
    borderBottomRightRadius: '2rem',
    background: '#fff'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  suggestion: {
    color: 'black',
    cursor: 'pointer',
    padding: '10px 20px'
  },
  suggestionHighlighted: {
    backgroundColor: '#ddd',
    borderRadius: '2rem',
  }
};

const people = [
  {
    first: 'Charlie',
    last: 'Brown',
    twitter: 'dancounsell'
  },
  {
    first: 'Charlotte',
    last: 'White',
    twitter: 'mtnmissy'
  },
  {
    first: 'Chloe',
    last: 'Jones',
    twitter: 'ladylexy'
  },
  {
    first: 'Cooper',
    last: 'King',
    twitter: 'steveodom'
  }
];

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const getSuggestions = value => {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('\\b' + escapedValue, 'i');

  return people.filter(person => regex.test(getSuggestionValue(person)));
};

const getSuggestionValue = suggestion =>
  `${suggestion.first} ${suggestion.last}`;

const renderSuggestion = (suggestion, { query }) => {
  const suggestionText = `${suggestion.first} ${suggestion.last}`;
  const matches = match(suggestionText, query);
  const parts = parse(suggestionText, matches);

  return (
    <span className={{}}>
      <span className={{}}>
        {parts.map((part, index) => {
          const className = null;

          return (
            <span className={className} key={index}>
              {part.text}
            </span>
          );
        })}
      </span>
    </span>
  );
};

const UPDATE_NETWORK_STATUS = gql`
mutation updateNetworkStatus($isConnected: Boolean) {
  updateNetworkStatus(isConnected: $isConnected) @client {
    isConnected
  }
}
`;


export default class ODSearchBox extends Component {

  state = {
    value: '',
    suggestions: [],
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  componentWillMount() {
    const v = this.props.value
    if (_.isString(v)) {
      this.setState({ value: v })
    } else if (_.isArray(v)) {
      this.setState({ value: v.join(',') })
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextValue = _.isArray(nextProps.value)
      ? nextProps.value.join(',')
      : nextProps.value
    if ((nextProps.value !== this.props.value) && _.isString(nextValue) &&
      (nextValue !== this.state.value)) {
      this.setState({ value: nextValue })
    }
  }

  render() {
    const { value, suggestions } = this.state
    const { label } = this.props

    return (
      <Mutation
        mutation={UPDATE_NETWORK_STATUS}
        variables={{ isConnected: !this.props.value }}>
        {(updateNetworkStatus, { loading, error }) => {
          return <Autosuggest
            id={`autosuggest-${label}`}
            theme={theme}
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={{
              placeholder: label,
              value,
              onChange: async (event, { newValue }) => {
                await updateNetworkStatus()
                this.setState({ value: newValue })
              }
            }}
          />
        }}
      </Mutation>
    )
  }
}

