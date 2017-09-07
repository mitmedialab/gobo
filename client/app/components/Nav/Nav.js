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
        const dropdownMenuClass = "dropdown-menu list-group keep-dropdown w230"

        const dropdownActions = user? (
            <ul className={dropdownMenuClass} tabIndex="0" onBlur={ ()=> this.setState( {dropdownOpen: false })} >
                <li className="list-group-item">
                    <span className="glyphicon glyphicon-user"></span>
                    <Link to={'/profile'}> <span>My Profile</span></Link>
                </li>
                <li className="list-group-item">
                    <span className="glyphicon glyphicon-align-center"></span>
                    <Link to={'/feed'}> <span>My Feed</span></Link>
                </li>
                <li className="list-group-item">
                    <span className="glyphicon glyphicon-log-out"></span>
                    <a onClick={()=>this.props.dispatch(logout())}><span>Logout</span></a>
                </li>
            </ul>
        ) :
            (<ul className={dropdownMenuClass} tabIndex="0" onBlur={ ()=> this.setState( {dropdownOpen: false })} >
                <li className="list-group-item">
                    <span className="glyphicon glyphicon-picture"></span>
                    <Link to={'/register'}><span>Sign Up</span></Link>
                </li>
                <li className="list-group-item">
                    <span className="glyphicon glyphicon-log-in"></span>
                    <Link to={'/login'}> <span>Login</span></Link>
                </li>
            </ul>)

        var dropdownClass = "dropdown dropdown-fuse navbar-user";
        if (this.state.dropdownOpen) {
            dropdownClass += " open"
        }


        const dropDownArrowDir = this.state.dropdownOpen? "up" :"down"
        const userName = user? (user.facebook_name? user.facebook_name.split(' ')[0] : user.twitter_name? '@'+user.twitter_name : 'User') : 'User'
        const dropdown =
            <li className={dropdownClass}>
                <a className="dropdown-toggle" onClick={this.toggleDropdown} aria-expanded={this.state.dropdownOpen}>
                    <img src={avatar} className="img-circle avatar" alt="Avatar"/>
                    {user && <span className="hidden-xs"><span className="name">{userName}</span></span>}
                    <span className={"glyphicon hidden-xs glyphicon-chevron-"+dropDownArrowDir}></span>
                </a>
                {dropdownActions}
            </li>

        return (

			<header className={this.props.auth.isAuthenticated? "logged" : ""}>
				<nav className="navbar navbar-fixed-top">
                    <ul className="nav navbar-nav navbar-left logo">
                        <li>
                        <Link to={'/'}>
                            <img alt="Gobo" src="static/images/gobo_temp_logo.png" height="100%" width="auto"/>
                            <span className="logo-title">GOBO</span>
                        </Link>
                        </li>
                    </ul>
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
