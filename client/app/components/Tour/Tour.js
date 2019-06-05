import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactJoyride, { STATUS } from 'react-joyride';
import ls from 'local-storage';

const LS_TOUR_KEY = 'tour-completed-v1.0.0';

class Tour extends Component {

  state = {
    tourCompleted: ls.get(LS_TOUR_KEY) || false,
    steps: [
      {
        target: '.setting-item',
        title: 'Title 1',
        content: 'Content 1',
      },
      {
        target: '.dropdown-toggle',
        title: 'Title 2',
        content: 'Content 2',
      },
      {
        target: '.filtered-text',
        title: 'Title 3',
        content: 'Content 3',
      },
      {
        target: '.feed',
        title: 'Title 4',
        content: 'Content 4',
      },
      {
        target: '.footer-text',
        title: 'Title 5',
        content: 'Content 5',
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
    if (this.props.feed.loading_posts || this.state.tourCompleted) {
      return (<div />);
    }
    return (
      <ReactJoyride
        steps={this.state.steps}
        callback={this.joyrideCallback}
        continuous
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
