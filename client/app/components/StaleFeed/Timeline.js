import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class Timeline extends Component {
  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate() {
    if (this.props.activeSection === this.props.section) {
      this.createChart();
    }
  }

  createChart = () => {
    const posts = [];

    const now = Date.now();
    const day = 1000 * 60 * 60 * 24;
    [...Array(40).keys()].forEach((i) => {
      const diff = Math.random() * day * 3;
      posts.push({
        timestamp: Date.now() - diff,
        tooltip: `${i}`,
      });
    });

    const height = 120 - 10;
    d3.select('.timeline')
      .selectAll('circle')
      .data(posts)
      .enter()
      .append('circle')
      .attr('cy', height)
      .attr('cx', () => Math.random() * 500)
      .attr('r', 5)
      .attr('fill', (d) => {
        if (d.timestamp > now - day) {
          return 'orange';
        }
        return 'gray';
      });
  }

  render() {
    const width = 500;
    const height = 120;
    const axisY = height - 10;

    return (
      <svg width={width} height={height}>
        <g id="timeline" className="timeline">
          <line x1="0" y1={`${axisY}`} x2={`${width}`} y2={`${axisY}`} stroke="gray" strokeWidth="5" />
        </g>
      </svg>
    );
  }
}

Timeline.propTypes = {
  activeSection: PropTypes.string.isRequired,
  section: PropTypes.string.isRequired,
};

export default Timeline;
