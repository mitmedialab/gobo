import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class GridVis extends Component {
  constructor(props) {
    super(props);

    const dim = 25;
    const rows = 5;
    const cols = 20;
    const now = Date.now();
    const day = 1000 * 60 * 60 * 24;
    const posts = this.computePosts(rows, cols, day);
    const postsB = this.computePosts(rows, cols, day);
    const postsC = this.computePosts(rows, cols, day);

    this.state = {
      posts,
      postsB,
      postsC,
      postWidth: 300,
      now,
      day,
      rows,
      cols,
      dim,
    };
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate() {
    if (this.props.activeSection === 'A') {
      this.transitionToPosts();
    } else if (this.props.activeSection === 'B') {
      this.transitionToColor();
    } else if (this.props.activeSection === 'C') {
      this.transitionToBlocks();
    } else if (this.props.activeSection === 'D') {
      this.transitionToFeed();
    } else if (this.props.activeSection === 'E') {
      this.transitionToOrdered();
    } else if (this.props.activeSection === 'F') {
      this.transitionToHistogram();
    }
  }

  computePosts = (rows, cols, day) => {
    const posts = [];
    [...Array(rows * cols).keys()].forEach((i) => {
      const diff = Math.random() * day * 3;
      posts.push({
        feedOrder: i,
        timestamp: Date.now() - diff,
        tooltip: `${i}`,
        postHeight: 50 + Math.round(Math.random() * 50),
      });
    });

    const sortedIndices = this.sortWithIndices(posts);
    sortedIndices.forEach((i, order) => {
      posts[i].categoryOrder = order;
    });
    return posts;
  }

  sortWithIndices = (posts) => {
    const toSort = [...posts];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < toSort.length; i++) {
      toSort[i] = [toSort[i], i];
    }
    toSort.sort((left, right) => (left[0].timestamp < right[0].timestamp ? -1 : 1));
    const sortIndices = [];
    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < toSort.length; j++) {
      sortIndices.push(toSort[j][1]);
    }
    return sortIndices;
  }

  createChart = () => {
    const { posts, postsB, postsC, now, day, dim, postWidth } = this.state;
    let nextY = 0;
    const postSpacing = 20;

    d3.select('.grid')
      .selectAll('rect')
      .data(posts)
      .enter()
      .append('rect')
      .attr('width', postWidth)
      .attr('height', d => d.postHeight)
      .attr('fill', '#dddddd')
      .attr('stroke', 'gray')
      .attr('stroke-width', 1)
      .attr('x', 0)
      .attr('y', (d) => {
        const y = nextY;
        nextY += d.postHeight + postSpacing;
        return y;
      });

    nextY = 0;
    d3.select('.grid')
      .selectAll('text')
      .data(posts)
      .enter()
      .append('text')
      .text(d => (new Date(d.timestamp)).toDateString())
      .attr('font-size', '20px')
      .attr('fill', 'black')
      .attr('x', 15)
      .attr('y', (d) => {
        const y = nextY;
        nextY += d.postHeight + postSpacing;
        return y + 25;
      });

    let staleX = 0;
    let recentX = 0;
    let staleY = 0;
    let recentY = 30;
    d3.select('.sectionB')
      .attr('opacity', 0)
      .select('.gridB')
      .selectAll('rect')
      .data(postsB)
      .enter()
      .append('rect')
      .attr('width', 3)
      .attr('height', dim)
      .attr('fill', (d) => {
        if (d.timestamp > now - day) {
          return 'orange';
        }
        return '#dddddd';
      })
      .attr('stroke-width', 0)
      .attr('x', (d) => {
        let x;
        if (d.timestamp > now - day) {
          x = recentX;
          recentX += 3;
        } else {
          x = staleX;
          staleX += 3;
        }
        return x;
      })
      .attr('y', (d) => {
        if (d.timestamp > now - day) {
          return recentY;
        }
        return staleY;
      });

    let recentPosts = postsB.filter(post => post.timestamp > now - day);
    d3.select('.sectionB')
      .select('.gridB')
      .selectAll('text')
      .data([postsB.length - recentPosts.length, recentPosts.length])
      .enter()
      .append('text')
      .text(d => `${d}/${postsB.length}`)
      .attr('y', (d, i) => 20 + (30 * i));

    staleX = 0;
    recentX = 0;
    staleY = 0;
    recentY = 30;
    d3.select('.sectionC')
      .attr('opacity', 0)
      .select('.gridC')
      .selectAll('rect')
      .data(postsC)
      .enter()
      .append('rect')
      .attr('width', 3)
      .attr('height', dim)
      .attr('fill', (d) => {
        if (d.timestamp > now - day) {
          return 'orange';
        }
        return '#dddddd';
      })
      .attr('stroke-width', 0)
      .attr('x', (d) => {
        let x;
        if (d.timestamp > now - day) {
          x = recentX;
          recentX += 3;
        } else {
          x = staleX;
          staleX += 3;
        }
        return x;
      })
      .attr('y', (d) => {
        if (d.timestamp > now - day) {
          return recentY;
        }
        return staleY;
      });

    recentPosts = postsC.filter(post => post.timestamp > now - day);
    d3.select('.sectionC')
      .select('.gridC')
      .selectAll('text')
      .data([postsC.length - recentPosts.length, recentPosts.length])
      .enter()
      .append('text')
      .text(d => `${d}/${postsC.length}`)
      .attr('y', (d, i) => 20 + (30 * i));

    d3.select('.legend')
      .attr('opacity', 0);
  }

  transitionToPosts = () => {
    d3.select('.grid')
      .selectAll('rect')
      .transition()
      .duration(1000)
      .attr('fill', '#dddddd');

    d3.select('.legend')
      .transition()
      .duration(1000)
      .attr('opacity', 0);
  }

  transitionToColor = () => {
    const { now, day, postWidth } = this.state;
    let nextY = 0;

    d3.select('.legend')
      .transition()
      .duration(1000)
      .attr('opacity', 1);

    d3.select('.grid')
      .selectAll('rect')
      .transition()
      .duration(1000)
      .attr('width', postWidth)
      .attr('height', d => d.postHeight)
      .attr('y', (d) => {
        const y = nextY;
        nextY += d.postHeight + 20;
        return y;
      })
      .attr('fill', (d) => {
        if (d.timestamp > now - day) {
          return 'orange';
        }
        return '#dddddd';
      });

    d3.select('.grid')
      .selectAll('text')
      .transition()
      .duration(2000)
      .attr('fill', 'black');
  }

  transitionToBlocks = () => {
    const { dim } = this.state;
    d3.select('.grid')
      .selectAll('text')
      .transition()
      .duration(500)
      .attr('fill', 'transparent');

    d3.select('.grid')
      .selectAll('rect')
      .transition()
      .duration(1000)
      .attr('width', dim)
      .attr('height', dim)
      .attr('x', 0)
      .attr('y', (d, i) => i * dim);
  }

  transitionToFeed = () => {
    const { cols, dim } = this.state;

    d3.select('.grid')
      .selectAll('rect')
      .transition()
      .duration(1000)
      .attr('x', (d, i) => {
        const col = i % cols;
        return col * dim;
      })
      .attr('y', (d, i) => {
        const row = Math.floor(i / cols);
        return row * dim;
      });
  }

  transitionToOrdered = () => {
    const { cols, dim } = this.state;

    d3.select('.grid')
      .selectAll('rect')
      .transition()
      .duration(1000)
      .attr('width', dim)
      .attr('stroke-width', 1)
      .attr('x', (d) => {
        const col = d.categoryOrder % cols;
        return col * dim;
      })
      .attr('y', (d) => {
        const row = Math.floor(d.categoryOrder / cols);
        return row * dim;
      });

    d3.select('.sectionB')
      .transition()
      .duration(500)
      .attr('opacity', 0);

    d3.select('.sectionC')
      .transition()
      .duration(500)
      .attr('opacity', 0);
  }

  transitionToHistogram = () => {
    const { now, day } = this.state;
    const dim = 3;

    let staleX = 0;
    let recentX = 0;

    const staleY = 0;
    const recentY = 30;

    d3.select('.grid')
      .selectAll('rect')
      .transition()
      .duration(1000)
      .attr('width', dim)
      .attr('stroke-width', 0)
      .attr('x', (d) => {
        let x;
        if (d.timestamp > now - day) {
          x = recentX;
          recentX += dim;
        } else {
          x = staleX;
          staleX += dim;
        }
        return x;
      })
      .attr('y', (d) => {
        if (d.timestamp > now - day) {
          return recentY;
        }
        return staleY;
      });

    d3.select('.sectionB')
      .transition()
      .duration(2000)
      .attr('opacity', 1);

    d3.select('.sectionC')
      .transition()
      .duration(2000)
      .attr('opacity', 1);
  }

  render() {
    const width = 600;

    return (
      <svg width={width} height="100%">
        <g transform="translate(20,20)" id="grid" className="legend">
          <rect fill="orange" width="20" height="20" x="0" y="0" />
          <text x="25" y="15">Recent</text>
          <rect fill="#dddddd" width="20" height="20" x="80" y="0" />
          <text x="105" y="15">Stale</text>
        </g>
        <g transform="translate(20,50)" id="grid" className="grid" />
        <g transform="translate(20,130)" className="sectionB">
          <text x="0" y="15">User B's Feed</text>
          <g transform="translate(0,25)" className="gridB" />
        </g>
        <g transform="translate(20,240)" className="sectionC">
          <text x="0" y="15">User C'c Feed</text>
          <g transform="translate(0,25)" className="gridC" />
        </g>
      </svg>
    );
  }
}

GridVis.propTypes = {
  activeSection: PropTypes.string.isRequired,
};

export default GridVis;
