import React, { Component } from 'react';
import { Waypoint } from 'react-waypoint';

import isEnabled, { SCROLLY_TELLING } from 'utils/featureFlags';

import Timeline from 'components/StaleFeed/Timeline';
import GridVis from 'components/StaleFeed/GridVis';


class StaleFeed extends Component {
  state = {
    activeSection: '',
    fixed: false,
  }

  onStepEnter = (step) => {
    this.setState({
      activeSection: step,
      fixedPosition: ['C', 'D', 'E', 'F'].includes(step),
    });
  }

  render() {
    const { fixedPosition } = this.state;
    if (!isEnabled(SCROLLY_TELLING)) {
      return (<div />);
    }

    return (
      <div className="fluid-container">
        <div className="row">
          <div className="col-lg-12">
            <h1>Do you know your feed?</h1>
            <p>Stuff about your feed! Learning more about you?</p>
            <p>Try Gobo!</p>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div
              style={fixedPosition ? { top: 0 } : { }}
              className={`${fixedPosition ? 'position-fixed' : 'position-absolute'} p-3 w-100 h-100`}
            >
              <GridVis activeSection={this.state.activeSection} />
            </div>
            <Waypoint
              topOffset={'33%'}
              bottomOffset={'66%'}
              onEnter={d => this.onStepEnter('A', d)}
            >
              <div id="scrolly-A" className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <h1 className="card-title">Part A: Your Feed</h1>
                    <p className="card-text">Stuff about how algorithms curate your feed.</p>
                    <p className="card-text">Here's an abstracted example of what our feed looked like.</p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={'33%'}
              bottomOffset={'66%'}
              onEnter={d => this.onStepEnter('B', d)}
            >
              <div id="scrolly-B" className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <h1 className="card-title">Part B: Highlight recent content</h1>
                    <p className="card-text">We looked at recency as a dimension used in algorithmic curation.</p>
                    <p className="card-text">You see a lot of old posts because...</p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={'33%'}
              bottomOffset={'66%'}
              onEnter={d => this.onStepEnter('C', d)}
            >
              <div className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <Timeline section="C" activeSection={this.state.activeSection} />
                    <h1 className="card-title">Part C: Lets zoom way out</h1>
                    <p className="card-text">Lets zoom way out to see how the rest of our feed looks.</p>
                    <p className="card-text">Recent vs. stale content is scattered and mixed up throughout our feed.</p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={'33%'}
              bottomOffset={'66%'}
              onEnter={d => this.onStepEnter('D', d)}
            >
              <div className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <h1 className="card-title">Part D: Lets reshape it so we can see it all</h1>
                    <p className="card-text">Lets reshape the feed further so that we can see the whole thing (well, as many pages as we captured).</p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={'33%'}
              bottomOffset={'66%'}
              onEnter={d => this.onStepEnter('E', d)}
            >
              <div className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <h1 className="card-title">Part E: Sort by time</h1>
                    <p />
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={'33%'}
              bottomOffset={'66%'}
              onEnter={d => this.onStepEnter('F', d)}
            >
              <div className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <h1 className="card-title">Part F: Summarize</h1>
                    <p className="card-text">Here's what some other feeds look like</p>
                    <p className="card-text">Here are some more resources...</p>
                    <p className="card-text">Here are more feeds from three of our researchers: Multiple times a day user, daily, rare (about once a week).</p>
                  </div>
                </div>
              </div>
            </Waypoint>
          </div>
        </div>
      </div>
    );
  }
}

export default StaleFeed;
