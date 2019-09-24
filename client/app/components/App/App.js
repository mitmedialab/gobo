import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Route, withRouter, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Async from 'react-code-splitting';
import Nav from 'components/Nav/Nav';
import { tryGetUser } from 'actions/auth';
import withTracker from 'utils/withTracker';

require('./app.scss');

const Landing = () => <Async load={import('components/Landing/Landing')} />;
const About = () => <Async load={import('components/About/About')} />;
const Login = () => <Async load={import('components/Login/Login')} />;
const RegisterWrapper = () => <Async load={import('components/RegisterWrapper/RegisterWrapper')} />;
const Feed = () => <Async load={import('components/Feed/Feed')} />;
const Profile = () => <Async load={import('components/Profile/Profile')} />;
const Privacy = () => <Async load={import('components/Privacy/Privacy')} />;
const TwitterCallback = () => <Async load={import('components/TwitterCallback/TwitterCallback')} />;
const MastodonAuthComplete = () => <Async load={import('components/MastodonAuthComplete/MastodonAuthComplete')} />;
const NoMatch = () => <Async load={import('components/NoMatch/NoMatch')} />;
const ForgotPassword = () => <Async load={import('components/ForgotPassword/ForgotPassword')} />;
const ResetPassword = () => <Async load={import('components/ResetPassword/ResetPassword')} />;
const StaleFeed = () => <Async load={import('components/StaleFeed/StaleFeed')} />;

class App extends Component {
  componentWillMount() {
    this.props.dispatch(tryGetUser());
  }

  render() {
    const Home = this.props.auth.isAuthenticated ? Feed : Landing;
    const homeTitle = this.props.auth.isAuthenticated ? 'feed' : 'landing';
    const helmet = (
      <Helmet>
        <title>Gobo</title>
        <meta name="description" content="A Site for Gobo Social" />
      </Helmet>
    );

    if (this.props.auth.isAuthenticating) {
      return helmet;
    }

    // Details for dev errors "Invalid prop 'component' supplied to 'Route': the prop is not a valid React component"
    // can be seen in https://github.com/ReactTraining/react-router/issues/6471 -- essentially, it should be
    // fixed at some point with a new version of the router and it's ok as is for now
    return (
      <div>
        {helmet}
        <Nav auth={this.props.auth} />
        <div role="main">
          <Switch>
            <Route exact path="/" component={withTracker(Home, { title: homeTitle, user: this.props.auth.user })} />
            <Route path="/login" component={withTracker(Login, { title: 'login', user: this.props.auth.user })} />
            <Route path="/register" component={withTracker(RegisterWrapper, { title: 'register', user: this.props.auth.user })} />
            <Route path="/feed" component={withTracker(Feed, { title: 'feed', user: this.props.auth.user })} />
            <Route path="/profile" component={withTracker(Profile, { title: 'profile', user: this.props.auth.user })} />
            <Route path="/twitter_callback" component={TwitterCallback} />
            <Route path="/mastodon_auth_complete" component={MastodonAuthComplete} />
            <Route path="/about" component={withTracker(About, { title: 'about', user: this.props.auth.user })} />
            <Route path="/privacy" component={withTracker(Privacy, { title: 'privacy', user: this.props.auth.user })} />
            <Route path="/forgot_password" component={withTracker(ForgotPassword, { title: 'forgot_password', user: this.props.auth.user })} />
            <Route path="/reset_password%3Ftoken%3D:token" component={withTracker(ResetPassword, { title: 'reset_password', user: this.props.auth.user })} />
            <Route path="/stale_feed" component={withTracker(StaleFeed, { title: 'stale_feed', user: this.props.auth.user })} />
            <Route path="/api/:function" />
            <Route path="*/" component={NoMatch} />
          </Switch>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

export default withRouter(connect(state => ({ auth: state.auth }))(App));
