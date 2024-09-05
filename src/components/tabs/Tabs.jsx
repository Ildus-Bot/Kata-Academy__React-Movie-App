import React from 'react';

import './Tabs.css';

export default class Tabs extends React.Component {
  state = {
    selected: 'source',
  };

  handleOnClick(selectedButton) {
    let rated;

    if (selectedButton === 'source') {
      rated = false;
    } else {
      rated = true;
    }

    this.props.onChangeState(rated);

    this.setState({
      selected: selectedButton,
    });
  }

  render() {
    const { selected } = this.state;

    const source = selected === 'source' ? selected : null;
    const rated = selected === 'rated' ? selected : null;

    return (
      <div className="tabs">
        <button
          className={source ? 'tabs__button selected' : 'tabs__button'}
          type="button"
          onClick={() => this.handleOnClick('source')}
        >
          Source
        </button>
        <button
          className={rated ? 'tabs__button selected' : 'tabs__button'}
          type="button"
          onClick={() => this.handleOnClick('rated')}
        >
          Rated
        </button>
      </div>
    );
  }
}
