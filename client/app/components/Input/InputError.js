import React from 'react';
import PropTypes from 'prop-types';
import { makeClassList } from 'utils/misc';

const InputError = (props) => {
  const errorClass = makeClassList({
    error_container: true,
    visible: props.visible,
    invisible: !props.visible,
  });

  return (
    <div className={errorClass}>
      <span>{props.errorMessage}</span>
    </div>
  );
};

InputError.propTypes = {
  visible: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
};

export default InputError;
