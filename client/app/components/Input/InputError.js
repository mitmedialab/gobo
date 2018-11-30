import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { makeClassList } from 'utils/misc';

const propTypes = {
  visible: PropTypes.bool,
  errorMessage: PropTypes.string,
};

class InputError extends Component {

  constructor(props) {
    super(props);
    this.state = {
      message: 'Input is invalid',
    };
  }

  render() {
    const errorClass = makeClassList({
      error_container: true,
      visible: this.props.visible,
      invisible: !this.props.visible,
    });

    return (
      <div className={errorClass}>
        <span>{this.props.errorMessage}</span>
      </div>
    );
  }

}

InputError.propTypes = propTypes;

export default InputError;
