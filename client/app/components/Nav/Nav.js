import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { logout } from 'actions/auth';
import { connect } from 'react-redux';


const propTypes = {
    auth: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
};

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false,
        };
        this.toggleDropdown = this.toggleDropdown.bind(this);
    }

    toggleDropdown() {
        this.setState( {
            dropdownOpen: !this.state.dropdownOpen
        })
    }

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
        const defaultAvatar = 'static/images/avatar.png';

        const avatar = user? user.avatar || defaultAvatar : defaultAvatar;

        const dropdownActions = user? (
            <ul className="dropdown-menu" tabIndex="0" onBlur={ ()=> this.setState( {dropdownOpen: false })} >
                <li className="list-group-item"><Link to={'/profile'}> <span>My Profile</span></Link></li>
                <li className="list-group-item"><a onClick={()=>this.props.dispatch(logout())}><span>Logout</span></a></li>
            </ul>
        ) :
            (<ul className="dropdown-menu list-group keep-dropdown w230" tabIndex="0" onBlur={ ()=> this.setState( {dropdownOpen: false })} >
                <li className="list-group-item"><Link to={'/register'}> <span>Sign Up</span></Link></li>
                <li className="list-group-item"><Link to={'/login'}> <span>Login</span></Link></li>
            </ul>)

        var dropdownClass = "dropdown dropdown-fuse navbar-user";
        if (this.state.dropdownOpen) {
            dropdownClass += " open"
        }

        const dropdown =
            <li className={dropdownClass}>
                <a className="dropdown-toggle" onClick={this.toggleDropdown} aria-expanded={this.state.dropdownOpen}>
                    <img src={avatar} className="img-circle" alt="Avatar"/>
                    {user && <span className="hidden-xs"><span className="name">{user.facebook_name.split(' ')[0]}</span></span>}
                    <span className="fa fa-caret-down hidden-xs"></span>
                </a>
                {dropdownActions}
            </li>

        return (

			<header className={this.props.auth.isAuthenticated? "logged" : ""}>
				<nav className="navbar navbar-fixed-top navbar-inverse">
                    <ul className="nav navbar-nav navbar-left logo">
                        <li>
                        <Link to={'/'}>
                            <img alt="Gobo" src="static/images/logo.png" height="100%"/>
                        </Link>
                        </li>
                    </ul>
						{/*<div className="navbar-header">*/}
							{/*<Link className="navbar-brand" to={'/'}>*/}
								{/*<img alt="Gobo" src="/images/logo.png" height="100%"/>*/}
							{/*</Link>*/}
						{/*</div>*/}
						<ul className="nav navbar-nav navbar-right">
                                {dropdown}
						</ul>
				</nav>
			</header>
        );

    }
};

function mapStateToProps(state) {
    return {
        auth: state.auth,
    };
}

NavBar.propTypes = propTypes;
export default connect(mapStateToProps)(NavBar);
