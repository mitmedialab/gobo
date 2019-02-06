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
      <div className="registration-screen">
        <h1>Registration</h1>
        <div className="registration-form">
          <div className="content">
            <div>{this.state.label}</div>'
          </div>
        </div>
      </div>
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
