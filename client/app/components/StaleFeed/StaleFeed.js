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
      fixedPositionPreamble: ['PREAMBLE_START', 'PREAMBLE_ALGORITHMS', 'WHY_STALE'].includes(step),
      fixedPosition: ['START_GRID', 'SORT_BY_TIME', 'ONE_HISTOGRAM', 'ALL_HISTOGRAMS', 'CREDITS'].includes(step),
    });
  }

  render() {
    const { fixedPosition, fixedPositionPreamble, activeSection } = this.state;
    const topOffset = '33%';
    const bottomOffset = '33%';

    if (!isEnabled(SCROLLY_TELLING)) {
      return (<div />);
    }

    return (
      <div className="fluid-container">
        <Waypoint
          topOffset={'5%'}
          bottomOffset={'100%'}
          onEnter={d => this.onStepEnter('INTRO', d)}
        >
          <div className="row">
            <div className="col-lg-12 stale-opening">
              <div className="pt-5 pb-5">
                <h1>The Fight Over the Feed</h1>
                <p className="pt-5">Exploring just how real-time your Facebook feed might be</p>
              </div>
            </div>
          </div>
        </Waypoint>

        <div
          style={fixedPositionPreamble ? { top: 0 } : { }}
          className={`${fixedPositionPreamble ? 'position-fixed' : 'position-absolute'} w-100 h-100`}
        >
          <div className="carousel-inner">
            <div className={`carousel-item ${activeSection === 'PREAMBLE_START' ? 'active' : 'inactive'}`}>
              <img className="d-block vw-100 vh-100" src="https://media.giphy.com/media/1iu8uG2cjYFZS6wTxv/giphy.gif" alt="First slide" />
            </div>
            <div className={`carousel-item ${activeSection === 'PREAMBLE_ALGORITHMS' ? 'active' : 'inactive'}`}>
              <img className="d-block vw-100 vh-100" src="https://media.giphy.com/media/VgqRvZymwFis4NcPLE/giphy.gif" alt="Second slide" />
            </div>
            <div className={`carousel-item ${activeSection === 'WHY_STALE' ? 'active' : 'inactive'}`}>
              <img className="d-block w-100" src="https://media.giphy.com/media/iIMwMis2QFzBZUcKhf/giphy.gif" alt="Third slide" />
            </div>
          </div>
        </div>


        <Waypoint
          topOffset={'5%'}
          bottomOffset={'100%'}
          onEnter={d => this.onStepEnter('PREAMBLE_START', d)}
        >
          <div className="row">
            <div className="col-lg-12 vh-100">
              <div className="d-flex justify-content-center">
                <div className="card">
                  <p className="card-text">On average, we spend 38 minutes a day on social media.</p>
                  <p className="card-text">A good chunk of this time is spent scrolling through “feeds”, where
                  we encounter all sorts of content -- news articles, vacation photos, memes, and more.</p>
                </div>
              </div>
            </div>
          </div>
        </Waypoint>

        <Waypoint
          topOffset={'5%'}
          bottomOffset={'100%'}
          onEnter={d => this.onStepEnter('PREAMBLE_ALGORITHMS', d)}
        >
          <div className="row">
            <div className="col-lg-12 vh-100">
              <div className="d-flex justify-content-center">
                <div className="card">
                  <p className="card-text">Facebook first introduced the “News Feed” on September 5, 2006. It started as a long list of updates from your friends, where the most recent posts showed up first.</p>
                  <p className="card-text">But by 2011, the News Feed was no longer about showing you the newest content.</p>
                  <p className="card-text">By this point, your News Feed was being sorted by...</p>
                  <p className="card-text">~Algorithms~ [some kind of cheesy visual?]</p>
                </div>
              </div>
            </div>
          </div>
        </Waypoint>

        <div className="row">
          <div className="col-lg-12">
            <div
              style={fixedPosition ? { top: 0 } : { }}
              className={`${fixedPosition ? 'position-fixed' : 'position-absolute'} w-100 h-100`}
            >
              <GridVis activeSection={this.state.activeSection} />
            </div>
            <Waypoint
              topOffset={'5%'}
              bottomOffset={'100%'}
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
                    <p className="card-text">Turns out, a full XX% of our posts were not from today! This is pretty different from the original idea of the social media feed,when we expected to see whatever was happening "right now." </p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('WHY_STALE', d)}
            >
              <div className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <p className="card-text">
                      So why is Facebook trying to show us this stale content? They recently added a
                      "why am I seeing this" feature that tries to explain what their algorithm is up to
                      when it picks each post to include in your "top" feed.
                    </p>
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
                    <p className="card-text">Our whole team did this experiment, and here's how the freshness for each of our feeds broke down. As you can see, the algorithm is interacting a little different for each of us. Companies like Facebook don't talk much about this, but it is really important to understand because what we see on our social media feeds shapes how we understand what is going on in the world around us.</p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={0}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('CREDITS', d)}
            >
              <div className="vh-50" />
            </Waypoint>
          </div>
        </div>

        <div className="row stale-container">
          <div className="col-lg-12 m-4">
            <h2>Curious to learn more?</h2>
            <p>Do you want to learn more about how algorithms control what we see? Read these short articles:</p>
            <ul>
              <li>TBD</li>
              <li>TBD</li>
              <li>TBD</li>
            </ul>

            <p>Want to explore a different way control your own feed? Signup for our Gobo.social online social media browser. You can connect your social media accounts and use our various rules to control what content get shown to you, and what gets hidden.</p>
            <div className="d-flex justify-content-center p-4">
              <img className="landing-civic-logo" src="images/gobo-logo.png" />
            </div>

            <p>Want to learn more about the impact of algorithms in other parts of society? Buy these great books, or check them out from your local library:</p>
            <ul>
              <li>Algorithms of Oppression - Safiya Noble</li>
              <li>Weapons of Math Destruction - Cathy O'Neil</li>
              <li>Automating Inequality - Virginia Eubanks</li>
            </ul>

            <h2>Credits</h2>
            <p>Anna Chung, Dennis Jen, Rahul Bhargava</p>
            <h2>Methodology</h2>
            <p>
              Each researcher logged into their Facebook account and collected the date a post was created
              and the order in which the post appeared in the feed. This was all done during a single
              sessions with at least 100 posts. The visualizations is limited to the first 100 posts in
              each feed.
            </p>
            <div className="d-flex justify-content-center">
              <a target="_blank" rel="noopener noreferrer" href="https://www.media.mit.edu/groups/civic-media/overview/"><img className="landing-civic-logo m-3" alt="Civic Media Logo" src="images/civic-media-logo-black.png" /></a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StaleFeed;
