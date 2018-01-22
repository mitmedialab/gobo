import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteUser } from '../../actions/auth';


const propTypes = {
	dispatch: PropTypes.func.isRequired,
};

class DeleteAccountButton extends Component {
		constructor(props) {
		super(props);
		// this.state = {
		// };
		this.onButtonClick = this.onButtonClick.bind(this);
	}

	onButtonClick() {
		this.props.dispatch(deleteUser());
	}

	render() {
		return (
			<div className="delete_account_button">
				<button onClick={this.onButtonClick} className="button button_wide button_delete">
					Delete my account
				</button>
			</div>
		);
	}
}

DeleteAccountButton.propTypes = propTypes;

export default connect(state => ({}))(DeleteAccountButton);
