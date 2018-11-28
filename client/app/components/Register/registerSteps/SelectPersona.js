import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { postPoliticalAffiliationToServer } from '../../../utils/apiRequests';

const propTypes = {
  onFinish: PropTypes.func.isRequired,
};

const politicalEnum = {
  left: 1,
  'center left': 2,
  center: 3,
  'center right': 4,
  right: 5,
};

class SelectPersona extends Component {
  handleClick(num) {
    postPoliticalAffiliationToServer(num);
    this.props.onFinish();
  }
  render() {
    return (
      <div>
        <p>
          To tailor your feed, tell us a little about what type of news you read.
          <br />
          Scan the names of popular news sites below and click on the one you read most.
          <br />
          This will help us tailor the news filter that we let you control.
        </p>
        <button className="button button_wide" onClick={() => this.handleClick(politicalEnum.left)}>
          Huffington Post, MSNBC, Vox
        </button>

        <button className="button button_wide" onClick={() => this.handleClick(politicalEnum['center left'])}>
          NYTimes, BuzzFeed, Time
        </button>

        <button className="button button_wide" onClick={() => this.handleClick(politicalEnum.center)}>
          The Hill, ABC News, Business Week
        </button>

        <button className="button button_wide" onClick={() => this.handleClick(politicalEnum['center right'])}>
          Examiner, National Review, US Chronicle
        </button>

        <button className="button button_wide" onClick={() => this.handleClick(politicalEnum.right)}>
          Breitbart, Daily Caller, Fox News
        </button>

      </div>
    );
  }
}

SelectPersona.propTypes = propTypes;

export default SelectPersona;
