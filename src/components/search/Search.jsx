import React from 'react';
import debounce from 'lodash.debounce';

import './Search.css';

class Search extends React.Component {
  debounced = debounce(
    () => (this.state.valueOnInput !== '' ? this.props.onSetMovieName(this.state.valueOnInput) : null),
    250
  );

  state = {
    valueOnInput: '',
  };

  handleChange = (e) => {
    this.debounced();
    this.setState({
      valueOnInput: e.target.value,
    });
  };

  render() {
    return (
      <input
        value={this.state.valueOnInput}
        className="search"
        placeholder="Type to search..."
        onChange={this.handleChange}
      />
    );
  }
}

export default Search;
