import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteUser } from '../../actions/auth';


const propTypes = {
  dispatch: PropTypes.func.isRequired,
  auth: PropTypes.object,
  isDeleting: PropTypes.bool,
  isDeleted: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    isDeleting: state.auth.isDeleting,
    isDeleted: state.auth.isDeleted,
  };
}


class DeleteAccountButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonText: 'Delete my account',
    };
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isDeleting && !nextProps.isDeleted) {
      this.setState({ buttonText: 'Error deleting account. Try again!' });
    }
  }

  onButtonClick() {
    this.props.dispatch(deleteUser());
  }

  render() {
    return (
      <div className="delete_account_button">
        <button onClick={this.onButtonClick} className="button button_wide button_delete">
          {this.state.buttonText}
        </button>
      </div>
    );
  }
}

DeleteAccountButton.propTypes = propTypes;

export default connect(mapStateToProps)(DeleteAccountButton);
