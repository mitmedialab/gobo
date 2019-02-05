import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';


class Rules extends Component {

  constructor(props) {
    super(props);
    this.state = {
      label: 'WIP',
    };
  }

  render() {
    return (
      <div>{this.state.label}</div>
    );
  }
}

// Rules.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

function mapStateToProps() {
  return {
  };
}

export default withRouter(connect(mapStateToProps)(Rules));
