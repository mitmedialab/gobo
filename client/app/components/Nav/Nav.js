import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { logout } from 'actions/auth';
import { updateShowPlatform } from 'actions/feed';
import { connect } from 'react-redux';
import onClickOutside from 'react-onclickoutside';


const DROP_DOWN_MENU_CLASSES = 'dropdown-menu list-group keep-dropdown w230';

class NavBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accountOpen: false,
      platformsOpen: false,
    };
  }

  getUserName = (user) => {
    let userName = 'User';
    if (user) {
      if (user.facebook_name) {
        userName = user.facebook_name.split(' ')[0];
      } else if (user.twitter_name) {
        userName = `@${user.twitter_name}`;
      } else if (user.mastodon_name) {
        userName = `${user.mastodon_name}@${user.mastodon_domain}`;
      }
    }
    return userName;
  }

  getNavLinkItem = (glyphType, link, text, toggleDropdown) => (
    <li className="list-group-item" role="menuitem" onClick={toggleDropdown}>
      <span className={`glyphicon ${glyphType}`} />
      <Link to={`${link}`}> <span>{text}</span></Link>
    </li>
  );

  getNavButtonItem = (iconClass, text, toggleDropdown, handleClick, enabled = true) => (
    <li className="list-group-item" role="menuitem" onClick={toggleDropdown}>
      <button className="nav-menu-button" disabled={!enabled} onClick={handleClick}><span className={`nav-menu-icon ${iconClass}`} /><span>{text}</span></button>
    </li>
  )

  isFeed = () => {
    const { location } = this.props;
    const current = location.pathname.replace(/^\/+|\/+$/g, '');
    return current === '' || current === 'feed';
  }

  toggleAccountsDropdown = () => {
    this.setState({
      accountOpen: !this.state.accountOpen,
      platformsOpen: false,
    });
  }

  togglePlatformsDropdown = () => {
    this.setState({
      platformsOpen: !this.state.platformsOpen,
      accountOpen: false,
    });
  }

  closeDropdown() {
    this.setState({
      accountOpen: false,
      platformsOpen: false,
    });
  }

  handleClickOutside = () => {
    this.closeDropdown();
  }

  handleLogout = () => {
    this.props.dispatch(logout());
  }

  handlePlatformChanged = (e) => {
    const platform = e.currentTarget.textContent.toLowerCase();
    this.props.dispatch(updateShowPlatform(platform));
  }

  renderAccountsDropdown = () => {
    const user = this.props.auth.isAuthenticated ? this.props.auth.user : null;

    const dropdownActions = user ? (
      <ul className={DROP_DOWN_MENU_CLASSES} role="menu" tabIndex="0" onBlur={() => this.setState({ accountOpen: false })} >
        {this.getNavLinkItem('glyphicon-user', '/profile', 'My Profile', this.toggleAccountsDropdown)}
        {this.getNavLinkItem('glyphicon-align-center', '/feed', 'My Feed', this.toggleAccountsDropdown)}
        {this.getNavLinkItem('glyphicon-info-sign', '/about', 'About Gobo', this.toggleAccountsDropdown)}
        {this.getNavLinkItem('glyphicon-eye-open', '/privacy', 'Privacy Policy', this.toggleAccountsDropdown)}
        {this.getNavButtonItem('glyphicon glyphicon-log-out', 'Logout', this.toggleAccountsDropdown, this.handleLogout)}
      </ul>
    ) :
      (<ul className={DROP_DOWN_MENU_CLASSES} role="menu" tabIndex="0" onBlur={() => this.setState({ accountOpen: false })} >
        {this.getNavLinkItem('glyphicon-picture', '/register', 'Register', this.toggleAccountsDropdown)}
        {this.getNavLinkItem('glyphicon-log-in', '/login', 'Login', this.toggleAccountsDropdown)}
        {this.getNavLinkItem('glyphicon-eye-open', '/privacy', 'Privacy Policy', this.toggleAccountsDropdown)}
      </ul>);

    let dropdownClass = 'dropdown dropdown-fuse navbar-user';
    if (this.state.accountOpen) {
      dropdownClass += ' open';
    }

    const defaultAvatar = 'images/avatar.png';
    const avatar = user ? user.avatar || defaultAvatar : defaultAvatar;
    const dropDownArrowDir = this.state.accountOpen ? 'up' : 'down';
    const userName = this.getUserName(user);
    return (
      <li className={dropdownClass}>
        <a className="dropdown-toggle" onClick={this.toggleAccountsDropdown} aria-expanded={this.state.accountOpen} role="button">
          <img src={avatar} className="img-circle avatar" alt="Avatar" />
          {user && <span className="hidden-xs"><span className="name">{userName}</span></span>}
          <span className={`glyphicon hidden-xs glyphicon-chevron-${dropDownArrowDir}`} />
        </a>
        {dropdownActions}
      </li>
    );
  }

  renderPlatformsDropdown = () => {
    const { user } = this.props.auth;
    let dropdownClass = 'dropdown dropdown-fuse';
    dropdownClass += this.state.platformsOpen ? ' open' : '';
    const dropDownArrowDir = this.state.platformsOpen ? 'up' : 'down';
    return (
      <li className={dropdownClass}>
        <button className="dropdown-toggle" onClick={this.togglePlatformsDropdown} aria-expanded={this.state.platformsOpen}>
          <span className="name capitalize">{`${this.props.feed.showPlatform}`}</span>
          <span className={`dropdown-toggle-icon glyphicon hidden-xs glyphicon-chevron-${dropDownArrowDir}`} />
        </button>
        <ul className={DROP_DOWN_MENU_CLASSES} role="menu" tabIndex="0" onBlur={() => this.setState({ platformsOpen: false })} >
          {this.getNavButtonItem('glyphicon glyphicon-globe', 'All', this.togglePlatformsDropdown, this.handlePlatformChanged)}
          {this.getNavButtonItem('icon-twitter-squared', 'Twitter', this.togglePlatformsDropdown, this.handlePlatformChanged, user.twitter_authorized)}
          {this.getNavButtonItem('icon-facebook-squared', 'Facebook', this.togglePlatformsDropdown, this.handlePlatformChanged, user.facebook_authorized)}
          {this.getNavButtonItem('icon-mastodon-logo', 'Mastodon', this.togglePlatformsDropdown, this.handlePlatformChanged, user.mastodon_authorized)}
          {this.getNavLinkItem('glyphicon glyphicon-plus-sign', '/profile', 'Add', this.togglePlatformsDropdown)}
        </ul>
      </li>
    );
  }

  renderNavBar = () => (
    <header className={this.props.auth.isAuthenticated ? 'logged' : ''}>
      <nav className="navbar navbar-fixed-top">
        <ul className="nav navbar-nav navbar-left header-background-hover logo">
          <li>
            <Link to={'/'}>
              <img alt="Gobo logo" src="images/gobo-logo.png" />
              <span className="hidden-xs hidden-sm logo-title">Gobo</span>
            </Link>
          </li>
        </ul>
        { this.isFeed() && this.props.auth.user &&
          <ul className="nav navbar-nav navbar-left logo">
            {this.renderPlatformsDropdown()}
          </ul>
        }
        <ul className="nav navbar-nav navbar-right">
          {this.renderAccountsDropdown()}
        </ul>
      </nav>
    </header>
    );

  render() {
    if (this.props.auth.isAuthenticated || window.location.pathname !== '/') {
      return this.renderNavBar();
    }
    return (<div />);
  }

}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    feed: state.feed,
  };
}

NavBar.propTypes = {
  auth: PropTypes.object.isRequired,
  feed: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

export default withRouter(connect(mapStateToProps)(onClickOutside(NavBar)));
