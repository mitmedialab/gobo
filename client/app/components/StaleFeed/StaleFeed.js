import React, { Component } from 'react';
import { Waypoint } from 'react-waypoint';

import isEnabled, { SCROLLY_TELLING } from 'utils/featureFlags';

import GridVis from 'components/StaleFeed/GridVis';


class StaleFeed extends Component {
  state = {
    activeSection: '',
    fixed: false,
  }

  onStepEnter = (step) => {
    this.setState({
      activeSection: step,
      fixedPosition: ['START_GRID', 'SORT_BY_TIME', 'ONE_HISTOGRAM', 'ALL_HISTOGRAMS', 'CREDITS'].includes(step),
    });
  }

  render() {
    const { fixedPosition } = this.state;
    const topOffset = '33%';
    const bottomOffset = '33%';

    if (!isEnabled(SCROLLY_TELLING)) {
      return (<div />);
    }

    return (
      <div className="fluid-container">
        <div className="row">
          <div className="col-lg-12 stale-opening">
            <div className="vh-100 stale-container pt-5 pb-5">
              <h1>The Fight Over the Feed</h1>
              <p>Exploring just how real-time your Facebook feed might be</p>
              <p>On average, we spend 38 minutes a day on social media.</p>
              <p>A good chunk of this time is spent scrolling through “feeds”, where
              we encounter all sorts of content -- news articles, vacation photos, memes, and more.</p>
              <p>[visual: gif or images of feed content]</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 stale-opening">
            <div className="vh-100 stale-container pt-5 pb-5">
              <p>Facebook first introduced the “News Feed” on September 5, 2006. It started as a long list of updates from your friends, where the most recent posts showed up first.</p>
              <p>But by 2011, the News Feed was no longer about showing you the newest content.</p>
              <p>By this point, your News Feed was being sorted by...</p>
              <p>~Algorithms~ [some kind of cheesy visual?]</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 stale-opening">
            <div className="vh-100 stale-container pt-5 pb-5">
              <p>Over the last year, both Facebook and Twitter recently added the option to flip between a default "Top Stories" views or a "Most Recent" view of your feed.</p>
              <p>[ visual: animated gif of toggling between views on FB and Twitter ]</p>
              <p>Just how different do “Top Stories” look from your “Most Recent” posts?</p>
              <p>How are algorithms reshuffling content in your feed?</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div
              style={fixedPosition ? { top: 0 } : { }}
              className={`${fixedPosition ? 'position-fixed' : 'position-absolute'} w-100 h-100`}
            >
              <GridVis activeSection={this.state.activeSection} />
            </div>
            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('START', d)}
            >
              <div id="scrolly-start" className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <p className="card-text">We decided to explore our Facebook feeds to see what the algorithms were up to.</p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('DATES', d)}
            >
              <div id="scrolly-start" className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <p className="card-text">We decided to explore our Facebook feeds to see what the algorithms were up to.</p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('BLOCKS', d)}
            >
              <div id="scrolly-blocks" className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <p className="card-text">Here's one of our feeds, colored by content from today and content from over a day ago.</p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('START_GRID', d)}
            >
              <div className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <p className="card-text">As you can see, it is quite a mix! All of those orange(?) posts? Those are older posts the algorithm has added in. Let's look at our last 100 posts to get a better sense of how much of the content is fresh, and how much is stale.</p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('SORT_BY_TIME', d)}
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
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('ONE_HISTOGRAM', d)}
            >
              <div className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <h1 className="card-title">Part F: Summarize</h1>
                    <p className="card-text">Here are more feeds from three of our researchers: Multiple times a day user, daily, rare (about once a week).</p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('ALL_HISTOGRAMS', d)}
            >
              <div className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <h1 className="card-title">Part F: Summarize</h1>
                    <p className="card-text">Here are more feeds from three of our researchers: Multiple times a day user, daily, rare (about once a week).</p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('CREDITS', d)}
            >
              <div className="vh-100">
                <div className="d-flex justify-content-center">
                  <a target="_blank" rel="noopener noreferrer" href="https://www.media.mit.edu/groups/civic-media/overview/"><img className="landing-civic-logo m-3" alt="Civic Media Logo" src="images/civic-media-logo-black.png" /></a>
                  <div className="card">
                    <p className="card-text">Credits: Anna Chung, Dennis Jen, Rahul Bhargava</p>
                    <p className="card-text">
                      During one session, each researcher collected the date a post was created and the order in
                      which it appeared in the feed.
                    </p>
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
