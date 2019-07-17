import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactJoyride, { STATUS } from 'react-joyride';
import ls from 'local-storage';

const LS_TOUR_KEY = 'intro-tour-completed-v1.0.0';

class Tour extends Component {

  state = {
    tourCompleted: ls.get(LS_TOUR_KEY) || false,
    steps: [
      {
        target: '.navbar-left img',
        title: 'Welcome to Gobo!',
        content: 'Here you can connect your social media accounts and explore different views of your feeds.',
      },
      {
        target: '.tour-rule-seriousness',
        title: 'Hide posts you don’t want to see.',
        content: 'Rules allow you to hide posts from your feed. For example, maybe you’re having a bad day and want to be entertained on social media. The seriousness rule allows you to hide the more serious stuff from your feed.',
      },
      {
        target: '.tour-rule-politics',
        title: 'Explore different perspectives.',
        content: 'Rules also allow you to add posts from accounts you might not be following. For example, maybe there are elections coming up and you want to explore how candidates are being covered by different sources. The politics rule allows you to add in posts from the left, right, or center.',
      },
      {
        target: '.tour-rule-rudeness',
        content: 'Scroll to check out more rules!',
      },
      {
        target: '.footer-text',
        title: 'Understand how posts are analyzed.',
        content: 'For each post, you can see how different rules are being applied to them and understand why some posts are shown -- and others are hidden.',
      },
      {
        target: '.filtered-text button',
        title: 'Explore what was taken out.',
        content: 'Wondering what you’re not seeing? Here you can view all of the posts that were hidden from your feed, based on the rules you set.',
      },
      {
        target: '.overview-wrapper',
        title: 'See how your feed is changing.',
        content: 'As posts are hidden and added, you can see how your overall feed is changing. Maybe you took a lot out, or maybe you added a lot in.',
      },
      {
        target: '.navbar-left button.dropdown-toggle',
        title: 'View and add different social media accounts.',
        content: 'Here you can add more social media accounts or view them separately.',
      },
    ],
  }

  joyrideCallback = (data) => {
    const { status } = data;
    if (status === STATUS.FINISHED) {
      ls.set(LS_TOUR_KEY, true);
      this.setState({
        tourCompleted: true,
      });
    }
  }

  render() {
    const hideTour = this.props.feed.loading_posts || this.state.tourCompleted;
    if (hideTour) {
      return (<div />);
    }
    return (
      <ReactJoyride
        steps={this.state.steps}
        scrollToFirstStep
        callback={this.joyrideCallback}
        continuous
        disableScrolling
        spotlightPadding={0}
        styles={{
          options: {
            zIndex: 1000000,  // some very high value so that it sits on top of the header
          },
        }}
      />
    );
  }
}

Tour.propTypes = {
  feed: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    feed: state.feed,
  };
}

export default connect(mapStateToProps)(Tour);
