import React from 'react';
import PropTypes from 'prop-types';
import { validateEmail } from 'utils/misc';

import Input from './Input';

const EmailInput = props => (
  <Input
    text="Email Address"
    type="text"
    defaultValue={props.email}
    validate={validateEmail}
    value={props.email}
    ref={props.onRef}
    onChange={e => props.onChange(e, 'email')}
    errorMessage="Email is invalid"
    emptyMessage="Email can't be empty"
  />
);

EmailInput.propTypes = {
  email: PropTypes.string.isRequired,
  onRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default EmailInput;
