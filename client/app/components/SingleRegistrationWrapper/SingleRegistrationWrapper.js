import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/Loader/Loader';

class SingleRegistrationWrapper extends Component {
  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.props.checkAndDispatch(e);
    }
  }

  render() {
    return (
      <div className="registration-screen" role="button" tabIndex={-1} onKeyPress={this.handleKeyPress}>
        <div className="registration-form">
          <h1>{this.props.heading}</h1>
          <form>
            {this.props.input}
            <button
              className="button button_wide"
              onClick={this.props.checkAndDispatch}
            >
              {this.props.buttonText}
            </button>
          </form>

          <div className="status-text">{this.props.statusText}</div>
          {this.props.isFetching && <Loader />}
        </div>
      </div>
    );
  }
}

SingleRegistrationWrapper.propTypes = {
  buttonText: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
  checkAndDispatch: PropTypes.func.isRequired,
  statusText: PropTypes.string,
  isFetching: PropTypes.bool,
};

SingleRegistrationWrapper.defaultProps = {
  statusText: '',
  isFetching: false,
};

export default SingleRegistrationWrapper;
