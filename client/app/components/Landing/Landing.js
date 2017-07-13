import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@blueprintjs/core';

const Landing = function() {
	return (
		<div id={'landing-page'}>
			<div>Welcome to Silica, login or sign up to start controlling your feed</div>
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
			<Link to={'/waves'}>
				<div className={'card'}>
					<span className={'title'}>Tidal Waves</span>
					<img src={'images/waves.png'} alt={'waves'} />
				</div>
			</Link>

			<Link to={'/forests'}>
				<div className={'card'}>
					<span className={'title'}>Forests</span>
					<img src={'images/forest.jpg'} alt={'forests'} />
				</div>
			</Link>
		</div>
	);
};

export default Landing;
