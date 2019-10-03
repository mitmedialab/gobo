import React, { Component } from 'react';
import { Waypoint } from 'react-waypoint';

import isEnabled, { SCROLLY_TELLING } from 'utils/featureFlags';

import Timeline from 'components/StaleFeed/Timeline';
import GridVis from 'components/StaleFeed/GridVis';


class StaleFeed extends Component {
  state = {
    activeSection: '',
  }

  onStepEnter = (step) => {
    this.setState({
      activeSection: step,
    });
  }

  render() {
    if (!isEnabled(SCROLLY_TELLING)) {
      return (<div />);
    }

    return (
      <div className="fluid-container">
        <div className="row">
          <div className="col-lg-6">
            <GridVis activeSection={this.state.activeSection} />
          </div>
          <div className="col-lg-6 overflow-auto vh-100" ref={this.scrollableRef}>
            <Waypoint
              topOffset={'33%'}
              bottomOffset={'66%'}
              onEnter={d => this.onStepEnter('A', d)}
            >
              <div id="scrolly-A" className="vh-100">
                <h1>Part A: Your Feed</h1>
                <p>Stuff about how algorithms curate your feed.</p>
                <p>Here's an abstracted example of what our feed looked like.</p>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={'33%'}
              bottomOffset={'66%'}
              onEnter={d => this.onStepEnter('B', d)}
            >
              <div id="scrolly-B" className="vh-100">
                <h1>Part B: Highlight recent content</h1>
                <p>We looked at recency as a dimension used in algorithmic curation.</p>
                <p>You see a lot of old posts because...</p>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={'33%'}
              bottomOffset={'66%'}
              onEnter={d => this.onStepEnter('C', d)}
            >
              <div className="vh-100">
                <Timeline section="C" activeSection={this.state.activeSection} />
                <h1>Part C: Lets zoom way out</h1>
                <p>Lets zoom way out to see how the rest of our feed looks.</p>
                <p>Recent vs. stale content is scattered and mixed up throughout our feed.</p>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={'33%'}
              bottomOffset={'66%'}
              onEnter={d => this.onStepEnter('D', d)}
            >
              <div className="vh-100">
                <h1>Part D: Lets reshape it so we can see it all</h1>
                <p>Lets reshape the feed further so that we can see the whole thing (well, as many pages as we captured).</p>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={'33%'}
              bottomOffset={'66%'}
              onEnter={d => this.onStepEnter('E', d)}
            >
              <div className="vh-100">
                <h1>Part E: Sort by time</h1>
                <p />
              </div>
            </Waypoint>

            <Waypoint
              topOffset={'33%'}
              bottomOffset={'66%'}
              onEnter={d => this.onStepEnter('F', d)}
            >
              <div className="vh-100">
                <h1>Part F: Summarize</h1>
                <p>Here's what some other feeds look like</p>
                <p>Here are some more resources...</p>
                <p>Here are more feeds from three of our researchers: Multiple times a day user, daily, rare (about once a week).</p>
              </div>
            </Waypoint>
          </div>
        </div>
      </div>
    );
  }
}

export default StaleFeed;
