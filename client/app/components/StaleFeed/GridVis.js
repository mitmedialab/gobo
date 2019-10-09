import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const DENNIS_FEED = { posts: [{ timestamp: 1570545847, feedOrder: 0, reactionCount: '1' }, { timestamp: 1569993362, feedOrder: 1, reactionCount: '124' }, { timestamp: 1570543437, feedOrder: 2, reactionCount: '1' }, { timestamp: 1570291744, feedOrder: 3, reactionCount: '105' }, { timestamp: 1570282188, feedOrder: 4, reactionCount: '24' }, { timestamp: 1570490302, feedOrder: 5, reactionCount: '11' }, { timestamp: 1570310408, feedOrder: 6, reactionCount: '13' }, { timestamp: 1570536451, feedOrder: 7, reactionCount: '5' }, { timestamp: 1570001147, feedOrder: 8, reactionCount: '3.3K' }, { timestamp: 1570154382, feedOrder: 9, reactionCount: '0' }, { timestamp: 1570492183, feedOrder: 10, reactionCount: '7' }, { timestamp: 1570538398, feedOrder: 11, reactionCount: '6' }, { timestamp: 1570491908, feedOrder: 12, reactionCount: '2' }, { timestamp: 1570325176, feedOrder: 13, reactionCount: '22' }, { timestamp: 1570462058, feedOrder: 14, reactionCount: '6' }, { timestamp: 1570207816, feedOrder: 15, reactionCount: '297' }, { timestamp: 1570473153, feedOrder: 16, reactionCount: '22' }, { timestamp: 1570503461, feedOrder: 17, reactionCount: '26' }, { timestamp: 1570494818, feedOrder: 18, reactionCount: '8' }, { timestamp: 1570491093, feedOrder: 19, reactionCount: '1' }, { timestamp: 1570478260, feedOrder: 20, reactionCount: '30' }, { timestamp: 1570292782, feedOrder: 21, reactionCount: '26' }, { timestamp: 1570237432, feedOrder: 22, reactionCount: '5' }, { timestamp: 1570539523, feedOrder: 23, reactionCount: '0' }, { timestamp: 1570510046, feedOrder: 24, reactionCount: '5' }, { timestamp: 1570032175, feedOrder: 25, reactionCount: '116' }, { timestamp: 1570493132, feedOrder: 26, reactionCount: '4' }, { timestamp: 1570516563, feedOrder: 27, reactionCount: '11' }, { timestamp: 1570541966, feedOrder: 28, reactionCount: '13' }, { timestamp: 1570486132, feedOrder: 29, reactionCount: '3' }, { timestamp: 1568977451, feedOrder: 30, reactionCount: '147K' }, { timestamp: 1570510090, feedOrder: 31, reactionCount: '3' }, { timestamp: 1570482640, feedOrder: 32, reactionCount: '0' }, { timestamp: 1569960104, feedOrder: 33, reactionCount: '162K' }, { timestamp: 1570545406, feedOrder: 34, reactionCount: '12' }, { timestamp: 1570495462, feedOrder: 35, reactionCount: '2' }, { timestamp: 1570540506, feedOrder: 36, reactionCount: '0' }, { timestamp: 1570363159, feedOrder: 37, reactionCount: '193' }, { timestamp: 1570489213, feedOrder: 38, reactionCount: '8' }, { timestamp: 1570195458, feedOrder: 39, reactionCount: '93K' }, { timestamp: 1570317321, feedOrder: 40, reactionCount: '1' }, { timestamp: 1570279433, feedOrder: 41, reactionCount: '32' }, { timestamp: 1570537933, feedOrder: 42, reactionCount: '1' }, { timestamp: 1568334504, feedOrder: 43, reactionCount: '11K' }, { timestamp: 1570226531, feedOrder: 44, reactionCount: '148' }, { timestamp: 1570546335, feedOrder: 45, reactionCount: '0' }, { timestamp: 1570496272, feedOrder: 46, reactionCount: '0' }, { timestamp: 1570544032, feedOrder: 47, reactionCount: '6' }, { timestamp: 1570544172, feedOrder: 48, reactionCount: '9' }, { timestamp: 1570413498, feedOrder: 49, reactionCount: '64' }, { timestamp: 1569085201, feedOrder: 50, reactionCount: '16K' }, { timestamp: 1570535002, feedOrder: 51, reactionCount: '53' }, { timestamp: 1570475892, feedOrder: 52, reactionCount: '3' }, { timestamp: 1570539742, feedOrder: 53, reactionCount: '0' }, { timestamp: 1570347164, feedOrder: 54, reactionCount: '19' }, { timestamp: 1570467142, feedOrder: 55, reactionCount: '5' }, { timestamp: 1570468219, feedOrder: 56, reactionCount: '0' }, { timestamp: 1570543046, feedOrder: 57, reactionCount: '0' }, { timestamp: 1570027276, feedOrder: 58, reactionCount: '645K' }, { timestamp: 1569978533, feedOrder: 59, reactionCount: '14' }, { timestamp: 1570476245, feedOrder: 60, reactionCount: '1' }, { timestamp: 1569977045, feedOrder: 61, reactionCount: '65' }, { timestamp: 1570314747, feedOrder: 62, reactionCount: '47' }, { timestamp: 1570384312, feedOrder: 63, reactionCount: '15' }, { timestamp: 1570452622, feedOrder: 64, reactionCount: '5' }, { timestamp: 1570173920, feedOrder: 65, reactionCount: '327' }, { timestamp: 1570453697, feedOrder: 66, reactionCount: '47' }, { timestamp: 1570452622, feedOrder: 67, reactionCount: '5' }, { timestamp: 1570453697, feedOrder: 68, reactionCount: '47' }, { timestamp: 1570462453, feedOrder: 69, reactionCount: '26' }, { timestamp: 1570478066, feedOrder: 70, reactionCount: '327' }, { timestamp: 1570286627, feedOrder: 71, reactionCount: '34' }, { timestamp: 1570455351, feedOrder: 72, reactionCount: '4' }, { timestamp: 1570459309, feedOrder: 73, reactionCount: '3' }, { timestamp: 1570459148, feedOrder: 74, reactionCount: '12' }, { timestamp: 1567036800, feedOrder: 75, reactionCount: '361K' }, { timestamp: 1570541010, feedOrder: 76, reactionCount: '3' }, { timestamp: 1570459148, feedOrder: 77, reactionCount: '12' }, { timestamp: 1567036800, feedOrder: 78, reactionCount: '361K' }, { timestamp: 1570541010, feedOrder: 79, reactionCount: '3' }, { timestamp: 1570541549, feedOrder: 80, reactionCount: '7' }, { timestamp: 1570518407, feedOrder: 81, reactionCount: '7' }, { timestamp: 1570541010, feedOrder: 82, reactionCount: '3' }, { timestamp: 1570541549, feedOrder: 83, reactionCount: '7' }, { timestamp: 1570518407, feedOrder: 84, reactionCount: '7' }, { timestamp: 1570222787, feedOrder: 85, reactionCount: '3' }, { timestamp: 1568614314, feedOrder: 86, reactionCount: '104K' }, { timestamp: 1570505385, feedOrder: 87, reactionCount: '21' }, { timestamp: 1570533350, feedOrder: 88, reactionCount: '0' }, { timestamp: 1570518261, feedOrder: 89, reactionCount: '61' }, { timestamp: 1570534391, feedOrder: 90, reactionCount: '0' }, { timestamp: 1570501860, feedOrder: 91, reactionCount: '80' }, { timestamp: 1570497341, feedOrder: 92, reactionCount: '29' }, { timestamp: 1570513845, feedOrder: 93, reactionCount: '1' }, { timestamp: 1570494380, feedOrder: 94, reactionCount: '40' }, { timestamp: 1570311958, feedOrder: 95, reactionCount: '14' }, { timestamp: 1570220176, feedOrder: 96, reactionCount: '2.2K' }, { timestamp: 1570297627, feedOrder: 97, reactionCount: '7' }, { timestamp: 1570449523, feedOrder: 98, reactionCount: '7' }, { timestamp: 1570241089, feedOrder: 99, reactionCount: '10' }, { timestamp: 1570075144, feedOrder: 100, reactionCount: '18' }, { timestamp: 1570453435, feedOrder: 101, reactionCount: '8' }, { timestamp: 1570449921, feedOrder: 102, reactionCount: '0' }, { timestamp: 1570536610, feedOrder: 103, reactionCount: '0' }, { timestamp: 1570496926, feedOrder: 104, reactionCount: '8' }, { timestamp: 1570342649, feedOrder: 105, reactionCount: '4.5K' }, { timestamp: 1570423550, feedOrder: 106, reactionCount: '2' }], exportSeconds: 1570548550.554 };


class GridVis extends Component {
  constructor(props) {
    super(props);

    const dim = 25;
    const rows = 5;
    const cols = 20;
    const day = 86400;
    const feedB = this.computeFeed(rows, cols, day);
    const feedC = this.computeFeed(rows, cols, day);

    this.preprocessPosts(DENNIS_FEED);

    this.state = {
      staleColor: '#dddddd',
      freshColor: 'orange',
      mainFeed: DENNIS_FEED,
      feedB,
      feedC,
      postWidth: 300,
      barWidth: 3,
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

  preprocessPosts = (feed) => {
    // eslint-disable-next-line no-param-reassign
    feed.posts = feed.posts.slice(0, 100);
    this.randomizePostHeight(feed.posts);
    this.computeSortIndices(feed.posts);
    this.computeStaleness(feed.posts, feed.exportSeconds);
  }

  randomizePostHeight = (posts) => {
    posts.forEach((post) => {
      // eslint-disable-next-line no-param-reassign
      post.postHeight = 50 + Math.round(Math.random() * 50);
    });
  }

  computeSortIndices = (posts) => {
    const sortedIndices = this.sortWithIndices(posts);
    sortedIndices.forEach((i, order) => {
      // eslint-disable-next-line no-param-reassign
      posts[i].categoryOrder = order;
    });
  }

  computeStaleness = (posts, exportSeconds) => {
    const day = 86400;
    posts.forEach((post) => {
      // eslint-disable-next-line no-param-reassign
      post.stale = post.timestamp < (exportSeconds - day);
    });
  }

  computeFeed = (rows, cols, day) => {
    const exportSeconds = Date.now() / 1000;
    const posts = [];
    [...Array(rows * cols).keys()].forEach((i) => {
      const diff = Math.random() * day * 3;
      posts.push({
        feedOrder: i,
        timestamp: exportSeconds - diff,
        tooltip: `${i}`,
        postHeight: 50 + Math.round(Math.random() * 50),
      });
    });
    this.computeStaleness(posts, exportSeconds);
    const sortedIndices = this.sortWithIndices(posts);
    sortedIndices.forEach((i, order) => {
      posts[i].categoryOrder = order;
    });
    return {
      exportSeconds,
      posts,
    };
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
    const { mainFeed, feedB, feedC, postWidth } = this.state;
    let nextY = 0;
    const postSpacing = 20;

    d3.select('.grid')
      .selectAll('rect')
      .data(mainFeed.posts)
      .enter()
      .append('rect')
      .attr('width', postWidth)
      .attr('height', d => d.postHeight)
      .attr('fill', this.state.staleColor)
      .attr('stroke', 'gray')
      .attr('stroke-width', 1)
      .attr('x', 0)
      .attr('y', (d) => {
        const y = nextY;
        nextY += d.postHeight + postSpacing;
        return y;
      });

    nextY = 0;
    d3.select('.postLabels')
      .selectAll('text.postLabel')
      .data(mainFeed.posts)
      .enter()
      .append('text')
      .attr('class', 'postLabel')
      .text(d => (new Date(d.timestamp * 1000)).toDateString())
      .attr('font-size', '20px')
      .attr('fill', 'black')
      .attr('x', 15)
      .attr('y', (d) => {
        const y = nextY;
        nextY += d.postHeight + postSpacing;
        return y + 25;
      });

    this.renderHistogramLabels(mainFeed, '.sectionA', '.grid')
      .attr('opacity', 0);

    this.renderHistogram(feedB, '.sectionB', '.gridB');
    this.renderHistogram(feedC, '.sectionC', '.gridC');

    d3.select('.legend')
      .attr('opacity', 0);
  }

  transitionToPosts = () => {
    d3.select('.grid')
      .selectAll('rect')
      .transition()
      .duration(1000)
      .attr('fill', this.state.staleColor);

    d3.select('.legend')
      .transition()
      .duration(1000)
      .attr('opacity', 0);
  }

  transitionToColor = () => {
    const { postWidth } = this.state;
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
      .attr('fill', d => (d.stale ? this.state.staleColor : this.state.freshColor));

    d3.select('.postLabels')
      .selectAll('text.postLabel')
      .transition()
      .duration(2000)
      .attr('fill', 'black');
  }

  transitionToBlocks = () => {
    const { dim } = this.state;

    d3.select('.postLabels')
      .selectAll('text.postLabel')
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

    ['.histogramLabel', '.sectionB', '.sectionC'].forEach((selector) => {
      d3.selectAll(selector)
        .transition()
        .duration(500)
        .attr('opacity', 0);
    });
  }

  transitionToHistogram = () => {
    const { barWidth } = this.state;
    let staleX = 0;
    let recentX = 0;
    const staleY = 0;
    const recentY = 30;

    d3.select('.grid')
      .selectAll('rect')
      .transition()
      .duration(1000)
      .attr('width', barWidth)
      .attr('stroke-width', 0)
      .attr('x', (d) => {
        let x;
        if (d.stale) {
          x = staleX;
          staleX += barWidth;
        } else {
          x = recentX;
          recentX += barWidth;
        }
        return x;
      })
      .attr('y', (d) => {
        if (d.stale) {
          return staleY;
        }
        return recentY;
      });

    ['.histogramLabel', '.sectionB', '.sectionC'].forEach((selector) => {
      d3.selectAll(selector)
        .transition()
        .duration(2000)
        .attr('opacity', 1);
    });
  }

  renderHistogram = (feed, section, grid) => {
    const { dim, barWidth } = this.state;
    let staleX = 0;
    let recentX = 0;
    const staleY = 0;
    const recentY = 30;
    d3.select(section)
      .attr('opacity', 0)
      .select(grid)
      .selectAll('rect')
      .data(feed.posts)
      .enter()
      .append('rect')
      .attr('width', barWidth)
      .attr('height', dim)
      .attr('fill', d => (d.stale ? this.state.staleColor : this.state.freshColor))
      .attr('stroke-width', 0)
      .attr('x', (d) => {
        let x;
        if (d.stale) {
          x = staleX;
          staleX += barWidth;
        } else {
          x = recentX;
          recentX += barWidth;
        }
        return x;
      })
      .attr('y', (d) => {
        if (d.stale) {
          return staleY;
        }
        return recentY;
      });

    this.renderHistogramLabels(feed, section, grid);
  }

  renderHistogramLabels = (feed, section, grid) => {
    const recentPosts = feed.posts.filter(post => !post.stale);
    return d3.select(section)
      .select(grid)
      .selectAll('text')
      .data([feed.posts.length - recentPosts.length, recentPosts.length])
      .enter()
      .append('text')
      .attr('class', 'histogramLabel')
      .text(d => `${d}/${feed.posts.length}`)
      .attr('y', (d, i) => 20 + (30 * i));
  }

  render() {
    const width = 600;

    return (
      <svg width={width} height="100%">
        <g transform="translate(20,20)" id="grid" className="legend">
          <rect fill={`${this.state.freshColor}`} width="20" height="20" x="0" y="0" />
          <text x="25" y="15">Recent</text>
          <rect fill={`${this.state.staleColor}`} width="20" height="20" x="80" y="0" />
          <text x="105" y="15">Stale</text>
        </g>
        <g transform="translate(20,25)" className="sectionA">
          <g transform="translate(0,25)" className="grid" />
          <g transform="translate(0,25)" className="postLabels" />
        </g>
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
