import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@blueprintjs/core';

const Landing = function() {
	return (
		<div id={'landing-page'}>
			<div>Welcome to Gobo, login or sign up to start controlling your feed</div>
			<div>
				<Link to={'/login'}>
					<Button
						text={'Login'}/>
				</Link>
				<Link to={'/register'}>
					<Button
						text={'Register'}/>
				</Link>
			</div>
		</div>
	);
};

export default Landing;
