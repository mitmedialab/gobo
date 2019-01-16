import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

const PasswordInput = props => (
  <Input
    text="Password"
    type="password"
    ref={props.onRef}
    validator={props.useValidator}
    minCharacters="6"
    requireCapitals="0"
    requireNumbers="1"
    forbiddenWords={props.forbiddenWords}
    value={props.password}
    emptyMessage="Password can't be empty"
    onChange={e => props.onChange(e, 'password')}
  />
);

PasswordInput.propTypes = {
  password: PropTypes.string.isRequired,
  onRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  useValidator: PropTypes.bool,
  forbiddenWords: PropTypes.array,
};

PasswordInput.defaultProps = {
  useValidator: true,
  forbiddenWords: ['password', 'user', 'username'],
};

export default PasswordInput;
