import React, { Component } from 'react';
import { Waypoint } from 'react-waypoint';

import isEnabled, { SCROLLY_TELLING } from 'utils/featureFlags';

import GridVis from 'components/StaleFeed/GridVis';


class StaleFeed extends Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
  }

  state = {
    activeSection: 'INTRO',
    fixed: false,
    backgroundColor: 'inherit-background',
  }

  onStepEnter = (step) => {
    this.setState({
      activeSection: step,
      fixedPositionPreamble: ['FB_EXPLAINATIONS_STATIC', 'FB_EXPLAINATIONS', 'ALGORITHM_HEADLINES', 'RECENT_TOP_TOGGLE', 'PREAMBLE_START', 'OLD_FACEBOOK', 'PREAMBLE_ALGORITHMS', 'WHY_SEE'].includes(step),
      fixedPosition: ['INTRO', 'START_GRID', 'SORT_BY_TIME', 'ONE_HISTOGRAM', 'ALL_HISTOGRAMS', 'CREDITS'].includes(step),
      backgroundColor: this.backgroundColors[step] ? this.backgroundColors[step] : 'inherit-background',
    });
  }

  backgroundColors = {
    ORANGE: 'orange-background',
    RED: 'red-background',
    GREEN: 'green-background',
    PURPLE: 'purple-background',
  }

  render() {
    const { fixedPosition, fixedPositionPreamble, activeSection, backgroundColor } = this.state;
    const topOffset = '15%';
    const bottomOffset = '15%';

    if (!isEnabled(SCROLLY_TELLING)) {
      return (<div />);
    }

    return (
      <div className={`fluid-container ${backgroundColor}`}>
        <Waypoint
          topOffset={'5%'}
          bottomOffset={'100%'}
          onEnter={d => this.onStepEnter('INTRO', d)}
        >
          <div className="row vh-100 stale-opening">
            <div className="col-lg-12">
              <div className="pt-4 pb-4 stale-background w-100">
                <h1>How Fresh Is Your Feed?</h1>
                <p className="pt-2">Social media promises to show you what's happening right now. We checked. It isn’t.</p>
                <p className="pt-2 stale-credits">By Anna Chung, Dennis Jen, and Rahul Bhargava</p>
                <p className="stale-credits">(a project from the <a className="stale-link" target="_blank" rel="noopener noreferrer" href="https://www.media.mit.edu/groups/civic-media/overview/">Center for Civic Media</a>)</p>
              </div>
            </div>
          </div>
        </Waypoint>

        <div
          style={fixedPositionPreamble ? { top: 0 } : { }}
          className={`${fixedPositionPreamble ? 'position-fixed' : 'position-absolute'} w-100 h-100`}
        >
          <div className="carousel-inner">
            <div className={`carousel-item justify-content-center ${activeSection === 'PREAMBLE_START' ? 'd-flex active' : 'inactive'}`}>
              <img className="d-block" src="images/fb-scrolling.gif" alt="Animation of news feed" />
            </div>
            <div className={`carousel-item justify-content-center ${activeSection === 'OLD_FACEBOOK' ? 'd-flex active' : 'inactive'}`}>
              <img className="d-block" src="images/old-fb-feed.jpg" alt="Old version of Facebook feed" />
            </div>
            <div className={`carousel-item justify-content-center ${activeSection === 'PREAMBLE_ALGORITHMS' ? 'd-flex active' : 'inactive'}`}>
              <img className="d-block" src="https://media.giphy.com/media/pcKpO81dLCPdLY1xYs/giphy.gif" alt="Algorithms are controlling your feed" />
            </div>
            <div className={`carousel-item justify-content-center ${activeSection === 'RECENT_TOP_TOGGLE' ? 'd-flex active' : 'inactive'}`}>
              <img className="d-block" src="images/feed-menu.png" alt="Toggles between recent vs. top news" />
            </div>
            <div className={`carousel-item  justify-content-center ${activeSection === 'ALGORITHM_HEADLINES' ? 'd-flex active' : 'inactive'}`}>
              <img className="d-block" src="images/algorithm-headlines.png" alt="Headlines of algorithm impact" />
            </div>
            <div className={`carousel-item  justify-content-center ${activeSection === 'WHY_SEE' ? 'd-flex active' : 'inactive'}`}>
              <img className="d-block" src="images/fb-why-am-i-seeing-this.gif" alt="Headlines of algorithm impact" />
            </div>
            <div className={`carousel-item  justify-content-center ${activeSection === 'FB_EXPLAINATIONS' ? 'd-flex active' : 'inactive'}`}>
              <img className="d-block" src="images/fb-explainations.gif" alt="Headlines of algorithm impact" />
            </div>
            <div className={`carousel-item  justify-content-center ${activeSection === 'FB_EXPLAINATIONS_STATIC' ? 'd-flex active' : 'inactive'}`}>
              <img className="d-block" src="images/fb-explainations-static.png" alt="Headlines of algorithm impact" />
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
                </div>
              </div>
            </div>
            <div className="col-lg-12 vh-100">
              <div className="d-flex justify-content-center">
                <div className="card">
                  <p className="card-text">A good chunk of this time is spent scrolling through “feeds,” where
                  we encounter all sorts of content ⁠— news articles, vacation photos, memes, and more.</p>
                </div>
              </div>
            </div>
          </div>
        </Waypoint>

        <Waypoint
          topOffset={topOffset}
          bottomOffset={bottomOffset}
          onEnter={d => this.onStepEnter('OLD_FACEBOOK', d)}
        >
          <div className="row">
            <div className="col-lg-12 vh-100">
              <div className="d-flex justify-content-center">
                <div className="card">
                  <p className="card-text">Facebook first introduced the “News Feed” on September 5, 2006. It started as a long list of updates from your friends, where the most recent posts showed up first.</p>
                </div>
              </div>
            </div>
          </div>
        </Waypoint>

        <Waypoint
          topOffset={topOffset}
          bottomOffset={bottomOffset}
          onEnter={d => this.onStepEnter('PREAMBLE_ALGORITHMS', d)}
        >
          <div className="row">
            <div className="col-lg-12 vh-100">
              <div className="d-flex justify-content-center">
                <div className="card">
                  <p className="card-text">But by 2011, the News Feed was no longer about showing you the newest content.</p>
                  <p className="card-text">By this point, your News Feed was being sorted by...</p>
                  <p className="card-text"><strong><i>Algorithms</i></strong></p>
                </div>
              </div>
            </div>
          </div>
        </Waypoint>

        <Waypoint
          topOffset={topOffset}
          bottomOffset={bottomOffset}
          onEnter={d => this.onStepEnter('RECENT_TOP_TOGGLE', d)}
        >
          <div className="row">
            <div className="col-lg-12 vh-100">
              <div className="d-flex justify-content-center">
                <div className="card">
                  <p className="card-text">Now the default is that you see “Top Stories”, <strong>not</strong> your “Most Recent” stuff.</p>
                </div>
              </div>
            </div>
          </div>
        </Waypoint>

        <Waypoint
          topOffset={topOffset}
          bottomOffset={bottomOffset}
          onEnter={d => this.onStepEnter('NONE', d)}
        >
          <div className="row">
            <div className="col-lg-12 vh-100">
              <div className="d-flex justify-content-center">
                <div className="card">
                  <p className="card-text">Just how different do “Top Stories” look from your “Most Recent” posts? How are algorithms reshuffling content in your feed?</p>
                </div>
              </div>
            </div>
          </div>
        </Waypoint>

        <div className="row">
          <div className="col-lg-12">
            <div
              style={fixedPosition ? { zIndex: -1, top: 0 } : { }}
              className={`${fixedPosition ? 'position-fixed' : 'position-absolute'} w-100 h-100`}
            >
              <GridVis activeSection={this.state.activeSection} />
            </div>

            <Waypoint
              topOffset={'5%'}
              bottomOffset={'15%'}
              onEnter={d => this.onStepEnter('START', d)}
            >
              <div id="scrolly-start" className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <p className="card-text">We decided to explore <strong>our</strong> Facebook feeds to see what the algorithms were up to.</p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={'5%'}
              bottomOffset={'15%'}
              onEnter={d => this.onStepEnter('START', d)}
            >
              <div className="vh-100" />
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('DATES', d)}
            >
              <div id="scrolly-start" className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <p className="card-text">Here's one of our feeds. We’ve highlighted the stale posts in <span className="stale-text">orange</span> - these were posted more than a day ago. The more recent posts from today are in grey.</p>
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
                    <p className="card-text">As you can see, it’s quite a mix! All of the <span className="stale-text">orange</span> posts? Those are stale posts the algorithm has mixed in.</p>
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
                    <p className="card-text">Let's look at our last 100 posts to get a better sense of how much of the content is fresh, and how much is stale.</p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('SORT_BY_TIME', d)}
            >
              <div className="vh-100" />
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('ONE_HISTOGRAM', d)}
            >
              <div className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <p className="card-text">Turns out, 34% of our posts were stale! This is pretty different from the original idea of the social media feed, when we expected to see whatever was happening "right now."</p>
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
                    <p className="card-text">Our whole team did this experiment, and here's how the freshness for each of our feeds broke down. As you can see, the algorithm is interacting a little different for each of us.</p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={'15%'}
              onEnter={d => this.onStepEnter('ALL_HISTOGRAMS', d)}
            >
              <div className="vh-100" />
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('PREAMBLE_START', d)}
            >
              <div className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <p className="card-text">
                      So why is Facebook trying to show us this stale content? For a long time they weren’t telling us.
                    </p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('ALGORITHM_HEADLINES', d)}
            >
              <div className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <p className="card-text">
                      Over the years people have been arguing about the impacts of the algorithm changes.
                    </p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('NONE', d)}
            >
              <div className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <p className="card-text">
                      So how is the algorithm deciding what we see and what we don’t?
                    </p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('WHY_SEE', d)}
            >
              <div className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <p className="card-text">
                      Facebook has recently tried to show us some of why, but it is hidden away. You can click the “why am I seeing this post” button to see some of the reasons.
                    </p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('FB_EXPLAINATIONS', d)}
            >
              <div className="vh-100" />
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('FB_EXPLAINATIONS_STATIC', d)}
            >
              <div className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <p className="card-text">
                      We didn’t realize just how much the algorithm is keeping track of what we do! And this is probably just a glimpse of everything their algorithm is up to.
                    </p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('NONE', d)}
            >
              <div className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <p className="card-text">
                      So we’re starting to see what’s going on, but we still can’t directly <strong>control</strong> what the algorithms are doing.
                    </p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('ORANGE', d)}
            >
              <div className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <p className="card-text">
                      What if you could see posts only from your closest family and friends?
                    </p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('PURPLE', d)}
            >
              <div className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <p className="card-text">
                      What if you could catch up on the news without distraction?
                    </p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('GREEN', d)}
            >
              <div className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <p className="card-text">
                      What if you could see more women’s voices in your feed?
                    </p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('RED', d)}
            >
              <div className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <p className="card-text">
                      What if you could filter out all the trolls?<br />
                    </p>
                  </div>
                </div>
              </div>
            </Waypoint>

            <Waypoint
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              onEnter={d => this.onStepEnter('NONE', d)}
            >
              <div className="vh-100">
                <div className="d-flex justify-content-center">
                  <div className="card">
                    <p className="card-text">
                      Right now, you can’t make those choices because the social media algorithms do. We think it’s important to challenge that.
                    </p>
                  </div>
                </div>
              </div>
            </Waypoint>

          </div>
        </div>

        <div className="row stale-container">
          <div className="col-lg-12 m-4">
            <h2>Curious to learn more?</h2>
            <p>Do you want to learn more about how algorithms control what we see? Read these short articles:</p>
            <ul>
              <li><a target="_blank" rel="noopener noreferrer" href="https://medium.com/trust-media-and-democracy/six-or-seven-things-social-media-can-do-for-democracy-66cee083b91a">Six or seven things social media can do for democracy</a> - by Ethan Zuckerman</li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://theconversation.com/explainer-how-facebook-has-become-the-worlds-largest-echo-chamber-91024">Explainer: how Facebook has become the world’s largest echo chamber</a> - Beth Daley (in The Conversation)</li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://techcrunch.com/2016/09/06/ultimate-guide-to-the-news-feed/">How Facebook News Feed Works</a> - Josh Costine (in Tech Crunch)</li>
            </ul>

            <div className="d-flex justify-content-center p-4">
              <img className="landing-civic-logo" src="images/gobo-logo.png" />
            </div>
            <p>Want to explore a different way control your own feed? Signup for our Gobo.social online social media browser. You can connect your social media accounts and use our various rules to control what content get shown to you, and what gets hidden.</p>

            <div className="d-flex justify-content-center p-4">
              <img className="w-100 h-100" src="images/book-covers.png" />
            </div>
            <p>Want to learn more about the impact of algorithms in other parts of society? Buy these great books, or check them out from your local library:</p>
            <ul>
              <li><a target="_blank" rel="noopener noreferrer" href="https://nyupress.org/9781479837243/algorithms-of-oppression/">Algorithms of Oppression</a> - Safiya Noble</li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://weaponsofmathdestructionbook.com">Weapons of Math Destruction</a> - Cathy O'Neil</li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://virginia-eubanks.com/books/">Automating Inequality</a> - Virginia Eubanks</li>
            </ul>

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
