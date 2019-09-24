import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class StubVis extends Component {
  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate() {
    if (this.props.activeSection === this.props.section) {
      this.createChart();
    }
  }

  createChart = () => {
    const circle = d3.selectAll('circle');
    circle
      .transition()
      .attr('cx', () => Math.random() * 300);
  }

  render() {
    const width = 300;
    const height = 120;

    return (
      <svg width={width} height={height}>
        <circle cx="40" cy="60" r="10" />
        <circle cx="80" cy="60" r="10" />
        <circle cx="120" cy="60" r="10" />
      </svg>
    );
  }
}

StubVis.propTypes = {
  activeSection: PropTypes.string.isRequired,
  section: PropTypes.string.isRequired,
};

export default StubVis;
