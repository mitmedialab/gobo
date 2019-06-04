import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactJoyride from 'react-joyride';


class Tour extends Component {

  constructor(props) {
    super(props);
    this.state = {
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
    };
  }

  render() {
    if (this.props.feed.loading_posts) {
      return (<div />);
    }
    return (
      <ReactJoyride
        steps={this.state.steps}
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
