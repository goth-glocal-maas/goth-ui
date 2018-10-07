import React, { Component } from 'react'
import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const theme = {
  container: {
    position: 'relative',
    display: 'inline-block',
    fontSize: '1.6rem',
    margin: '1rem',
    /* max-width: 400px, */
    width: 'calc(100% - 4rem)',
    verticalAlign: 'top',

    padding: 0,
    borderRadius: '2rem',
    background: 'transparent',
    border: 0,
    color: 'transparent',
    boxShadow: 'none',
  },
  input: {
    position: 'relative',
    display: 'block',
    float: 'right',
    padding: '0.8rem',
    width: '60%',
    border: 0,
    background: '#f0f0f0',
    color: '#aaa',
    fontWeight: 'bold',
    // font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    padding: '0.85rem 1.5rem',
    width: '100%',
    borderRadius: '2rem',
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
    console.log('will mount: ', this.props.value, this.state.value)
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.value, this.state.value)
    // if (nextProps.value !== this.state.value) {
    //   this.setState({value: nextProps.value})
    // }
  }

  render() {
    const { value, suggestions } = this.state;

    console.log('box props: ', this.props)
    return (
      <Mutation
        mutation={UPDATE_NETWORK_STATUS}
        variables={{ isConnected: !this.props.value }}>
        {(updateNetworkStatus, { loading, error }) => {
          return <Autosuggest
            id="destination"
            theme={theme}
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={{
              placeholder: "Type 'c'",
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
