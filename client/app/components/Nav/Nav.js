import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavBar extends Component {
    toggleSlide () {
        const elem = document.getElementsByClassName('nav-menu')[0];
        if (elem.className === 'nav-menu') {
            elem.className = 'nav-menu open';
        } else {
            elem.className = 'nav-menu';
        }
    }

    render() {
        const user = this.props.auth.isAuthenticated? this.props.auth.user : null;
        return (

			<div>
				<nav className="navbar navbar-fixed-top navbar-inverse">
					<div className="container-fluid">
						<div className="navbar-header">
							<Link className="navbar-brand" to={'/'}>
								<img alt="Gobo" src="/images/logo.png" height="100%"/>
							</Link>
						</div>
						<div className="navbar-collapse collapse">
                        {user &&<p className="navbar-text">{user.facebook_name} {user.twitter_name && '@'}{user.twitter_name}</p>}
						</div>
					</div>
				</nav>
			</div>
        );

    }
};

export default NavBar;
