import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { getData } from 'actions/app';

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	appData: PropTypes.object.isRequired,
};

class Forests extends Component {
	componentWillMount() {
		this.props.dispatch(getData('isTravis'));
	}

	render() {
		return (
			<div className={'page'}>
				<Helmet>
					<title>Forests</title>
				</Helmet>

				<h1>Forests</h1>
				<img width={'150px'} src={'images/forest.jpg'} alt={'forests'} />
				<div>{JSON.stringify(this.props.appData)}</div>
			</div>
		);
	}
}

Forests.propTypes = propTypes;
export default connect(state => ({ appData: state.app }))(Forests);
