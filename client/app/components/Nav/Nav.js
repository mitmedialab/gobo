import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = function() {
	const toggleSlide = function() {
		const elem = document.getElementsByClassName('nav-menu')[0];
		if (elem.className === 'nav-menu') {
			elem.className = 'nav-menu open';
		} else {
			elem.className = 'nav-menu';
		}
	};

	return (
		<div className="navbar-page">
			<div className={'navbar'}>
				<div className="row">
					<div className="logo"><Link to={'/'}><img src="/images/logo.png"/></Link></div>

					<div className="mobile-toggle">
						<span></span>
						<span></span>
						<span></span>
					</div>

					<nav>
						<ul>
							<li><a href=".sec01">Section 01</a></li>
							<li><a href=".sec02">Section 02</a></li>
							<li><a href=".sec03">Section 03</a></li>
							<li><a href=".sec04">Section 04</a></li>
						</ul>
					</nav>

				</div>
			</div>
		</div>

        // <div className="navbar-page">
		// 	<div className={'navbar'}>
		// 		<div className="logo"><Link to={'/'}><img src="/images/logo.png"/></Link></div>
		// 			<div className="menu">
		// 				<ul>
		// 					<li>Home</li>
		// 					<li>About</li>
		// 					<li>Profile</li>
		// 				</ul>
        //
		// 			</div>
        //
		// 		{/*<a role={'button'} tabIndex={0} className={'right'} onClick={toggleSlide}>Menu</a>*/}
        //
		// 		{/*<div role={'presentation'} className={'nav-menu'} onClick={toggleSlide}>*/}
		// 			{/*<div className={'content'}>*/}
		// 				{/*<ul>*/}
		// 					{/*<li>Item 1</li>*/}
		// 					{/*<li>Item 2</li>*/}
		// 					{/*<li>Item 3</li>*/}
		// 					{/*<li>Item 4</li>*/}
		// 				{/*</ul>*/}
		// 			{/*</div>*/}
		// 		{/*</div>*/}
		// 	</div>
		// </div>
	);
};

export default NavBar;
