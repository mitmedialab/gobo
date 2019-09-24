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
    <div className="dropdown-item list-group-item" role="menuitem" onClick={toggleDropdown}>
      <Link className="nav-menu-button" to={`${link}`}> <span className={`nav-menu-icon ${glyphType}`} /><span>{text}</span></Link>
    </div>
  );

  getNavButtonItem = (iconClass, text, toggleDropdown, handleClick, enabled = true) => (
    <a className="dropdown-item list-group-item" role="menuitem" onClick={toggleDropdown}>
      <button className="nav-menu-button" disabled={!enabled} onClick={handleClick}><span className={`nav-menu-icon ${iconClass}`} /><span>{text}</span></button>
    </a>
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
      <div className={DROP_DOWN_MENU_CLASSES} role="menu" tabIndex="0" onBlur={() => this.setState({ accountOpen: false })} >
        {this.getNavLinkItem('icon-user', '/profile', 'My Profile', this.toggleAccountsDropdown)}
        {this.getNavLinkItem('icon-align-center', '/feed', 'My Feed', this.toggleAccountsDropdown)}
        {this.getNavLinkItem('icon-info-circled', '/about', 'About Gobo', this.toggleAccountsDropdown)}
        {this.getNavLinkItem('icon-eye', '/privacy', 'Privacy Policy', this.toggleAccountsDropdown)}
        {this.getNavButtonItem('icon-logout', 'Logout', this.toggleAccountsDropdown, this.handleLogout)}
      </div>
    ) :
      (<div className={DROP_DOWN_MENU_CLASSES} role="menu" tabIndex="0" onBlur={() => this.setState({ accountOpen: false })} >
        {this.getNavLinkItem('icon-edit', '/register', 'Register', this.toggleAccountsDropdown)}
        {this.getNavLinkItem('icon-login', '/login', 'Login', this.toggleAccountsDropdown)}
        {this.getNavLinkItem('icon-eye', '/privacy', 'Privacy Policy', this.toggleAccountsDropdown)}
      </div>);

    let dropdownClass = 'dropdown dropdown-fuse navbar-user';
    if (this.state.accountOpen) {
      dropdownClass += ' open';
    }

    const defaultAvatar = 'images/avatar.png';
    const avatar = user ? user.avatar || defaultAvatar : defaultAvatar;
    const userName = this.getUserName(user);
    return (
      <span className={dropdownClass}>
        <button className="dropdown-toggle account" onClick={this.toggleAccountsDropdown} aria-expanded={this.state.accountOpen}>
          <img src={avatar} className="avatar rounded-circle" alt="Avatar" />
          {user && <span className="pl-2 d-none d-sm-inline">{userName}</span>}
        </button>
        {dropdownActions}
      </span>
    );
  }

  renderPlatformsDropdown = () => {
    const { user } = this.props.auth;
    let dropdownClass = 'dropdown dropdown-fuse';
    dropdownClass += this.state.platformsOpen ? ' open' : '';

    return (
      <span className={dropdownClass}>
        <button className="dropdown-toggle" onClick={this.togglePlatformsDropdown} aria-expanded={this.state.platformsOpen}>
          <span className="name capitalize">{`${this.props.feed.showPlatform}`}</span>
        </button>
        <div className={DROP_DOWN_MENU_CLASSES} role="menu" tabIndex="0" onBlur={() => this.setState({ platformsOpen: false })} >
          {this.getNavButtonItem('icon-users', 'All', this.togglePlatformsDropdown, this.handlePlatformChanged)}
          {this.getNavButtonItem('icon-twitter-squared', 'Twitter', this.togglePlatformsDropdown, this.handlePlatformChanged, user.twitter_authorized)}
          {this.getNavButtonItem('icon-facebook-squared', 'Facebook', this.togglePlatformsDropdown, this.handlePlatformChanged, user.facebook_authorized)}
          {this.getNavButtonItem('icon-mastodon-logo', 'Mastodon', this.togglePlatformsDropdown, this.handlePlatformChanged, user.mastodon_authorized)}
          {this.getNavLinkItem('icon-user-add', '/profile', 'Add', this.togglePlatformsDropdown)}
        </div>
      </span>
    );
  }

  renderNavBar = () => (
    <header className={this.props.auth.isAuthenticated ? 'logged' : ''}>
      <nav className="navbar fixed-top">
        <div className="nav navbar-nav navbar-left header-background-hover logo">
          <div>
            <Link to={'/'}>
              <img alt="Gobo logo" src="images/gobo-logo.png" />
              <span className="hidden-xs hidden-sm logo-title">Gobo</span>
            </Link>
            { this.isFeed() && this.props.auth.user &&
              <span>
                {this.renderPlatformsDropdown()}
              </span>
            }
          </div>
        </div>
        <div className="nav navbar-nav navbar-right">
          {this.renderAccountsDropdown()}
        </div>
      </nav>
    </header>
  );

  render() {
    if (window.location.pathname !== '/stale_feed') {
      if (this.props.auth.isAuthenticated || window.location.pathname !== '/') {
        return this.renderNavBar();
      }
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
