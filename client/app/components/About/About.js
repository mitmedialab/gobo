import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import { connect } from 'react-redux';

import { VERSION } from 'constants/index';
import COPY from 'constants/featuresCopy';


const About = (props) => {
  let loginContent;
  if (!props.auth.isAuthenticated) {
    loginContent = (
      <div className="row">
        <div className="col-md-6">
          <Link to={'/login'}>
            <Button className="button_wide" text={'Login'} />
          </Link>
        </div>
        <div className="col-md-6">
          <Link to={'/register'}>
            <Button className="button_wide" text={'Register'} />
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="content-with-nav">
      <div className="container-fluid about">
        {loginContent}
        <div className="row">
          <div className="col-lg-12 about-section">
            <h1>Your social media. Your rules.</h1>
            <p>
              Gobo is an experiment, not a startup. We’re building it to change the conversation on social
              media and imagine a better version of it. This is a technology-to-think-with -- a tool we want
              you to play with and push against. Gobo is being built by a small team at <a href="https://www.media.mit.edu/groups/civic-media/overview/" target="_blank" rel="noopener noreferrer">MIT Media Lab's Center for Civic Media</a>,
              where we work on technologies for social change. You can learn more about Gobo and why we built it in our FAQ.
            </p>
            <p>
              For questions, feedback, and musings, you can reach the Gobo team at <a href="mailto:gobo@media.mit.edu">gobo@media.mit.edu</a>.
            </p>

            <p>{VERSION}</p>

            <div className="row text-center">
              <div className="col-lg-12">
                <div className="about-navigation">
                  <Button className="colored-button orange-background" onClick={() => document.getElementById('features').scrollIntoView()} text="Features" />
                  <Button className="colored-button red-background" onClick={() => document.getElementById('faq').scrollIntoView()} text="FAQ" />
                  <br className="d-block d-md-none" />
                  <Button className="colored-button green-background" onClick={() => document.getElementById('team').scrollIntoView()} text="Team" />
                  <Button className="colored-button purple-background" onClick={() => document.getElementById('press').scrollIntoView()} text="Press" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="features" className="row colored-background orange-background">
          <div className="col-lg-12 about-section">
            <h1 >Features</h1>
            {['control', 'connect', 'see', 'perspective'].map(key =>
              (<div key={key}>
                <h2>{COPY[key].title}</h2>
                <p>{COPY[key].description}</p>
              </div>),
            )}
          </div>
        </div>

        <div id="faq" className="row colored-background red-background">
          <div className="col-lg-12 about-section">
            <h1>FAQ</h1>

            <h2>What is Gobo?</h2>
            <p>Gobo is a social media browser that gives you control and transparency over what you see. Through Gobo, you can connect your Twitter, Facebook, and Mastodon accounts and view all of these feeds in one place. Using a set of “rules”, you can choose to hide certain kinds of posts and show others. For example, our "obscurity" rule allows you to hide viral content that’s overwhelming your feed or surface hidden gems you might be missing. Meanwhile, our "politics" rule allows you to add content from political perspectives you aren’t seeing. Gobo aims to be completely transparent, showing you why each post was included in your feed and inviting you to explore which posts were hidden.</p>

            <h2>Why did we make it?</h2>
            <p>Social media companies hold a great deal of power over what we see online. Using opaque algorithms, these companies decide what we’re shown on our feeds -- and what we’re not shown. We have little say over how social media should work, and we think this needs to change. It is easier to criticize these companies and their profit motives, but it’s harder to build a viable alternative. We built Gobo to do that -- to demonstrate how we might be able to control social media rather than be controlled by it. What if we could choose to challenge ourselves one day, encountering perspectives different from our own, and relax another day, hiding more serious content? We see Gobo as a speculative tool -- a starting point in thinking about <a href="http://www.ethanzuckerman.com/blog/2018/12/09/we-make-the-media-a-recent-speech-at-freedom-of-speech-online-2018/">social media that serves our best interests.</a></p>

            <h2>How does it work?</h2>
            <p>Gobo retrieves posts from people you follow on Twitter, Facebook, and Mastodon and analyzes them using <a href="http://perspectiveapi.com/">machine learning APIs</a> and keyword identifiers. You can use most rules  to hide posts from your feed. The politics rules work differently, adding in posts instead of hiding them— if you set the politics slider towards “lots of perspectives”, posts will be added from political news sources that you likely don’t read every day.</p>

            <h2>Who made it?</h2>
            <p>Gobo is a project of the <a href="https://civic.mit.edu/">Center for Civic Media</a> at the <a href="https://media.mit.edu/">MIT Media Lab</a> and <a href="http://cmsw.mit.edu/">Comparative Media Studies</a> at MIT. Gobo is made possible by the <a href="https://knightfoundation.org/">Knight Foundation</a>, founding donors and longtime supporters of Civic Media, and the <a href="https://aiethicsinitiative.org/">Ethics and Governance of AI Initiative</a>. We’re thankful to both of these organizations and the people behind them!</p>

            <h2>Which platforms does Gobo support?</h2>
            <p>Currently, you can connect your Twitter, Facebook, and Mastodon accounts. We’re working on supporting more platforms soon!</p>

            <h2>What are rules?</h2>
            <p>Rules allow you to hide or add certain kinds of posts to your feed.</p>

            <h2>Can I make my own rules?</h2>
            <p>Technically yes. Gobo is an open source project, so if you have the development chops, you can <a href="https://github.com/mitmedialab/gobo">download our code</a> and add your own rules. However, we’re planning to add an easy option to create your own rules soon!</p>

            <h2>What are the limitations?</h2>
            <p>You might notice that there’s a lot less content from Facebook than from other platforms. That’s because Facebook allows us to show you posts from public pages you’ve liked, but not from your friends’ individual pages.</p>
            <p>You might also notice that rules don’t always work the way you’d expect. Some rules use open source machine learning tools while other rules are powered by our own algorithms. It’s a good reminder that these rules are always probabilistic and inexact — we want you to see where our system messes up, so we include information about what tools and datasets we’re using for each rule.</p>

            <h2>What’s our future plan for Gobo?</h2>
            <p>Major social media platforms do not serve our best interests and are impacting our society in some negative ways. However, we still believe in the core idea of social media -- using the web to be connected with other people. So rather than simply pointing out what the platforms are doing wrong, Gobo is our attempt to design what the future of social media could be. We hope others are encouraged to do the same, so we can move closer to a version of social media that serves us.</p>
            <p>We’re envisioning a future where it’s easy to navigate between several platforms. That’s why we recently integrated Mastodon, in addition to Twitter and Facebook. We’re experimenting with other platforms and plan to continue adding more!</p>
            <p>We’re also envisioning social media that’s more personalizable. Right now, you can play with rules we created, but our ultimate goal is for you to create your own rules. Our next step is to release a customizable rules, allowing you to be more specific about the posts you want to hide and add.</p>
            <p>Finally, we want you to be able to share these rules, so others can get a glimpse into your perspectives.</p>
            <p>Have any awesome ideas for the future of Gobo? We’d love to hear them at <a href="mailto:gobo@media.mit.edu">gobo@media.mit.edu</a>.</p>

            <h2>What does “Gobo” mean?</h2>
            <p>Ever seen a stage production where the lights look like they’re coming through a window, or the leaves of a forest? Those effects are created with <a href="https://en.wikipedia.org/wiki/Gobo_%28lighting%29">gobos</a>, filters cut from sheets of metal and placed in front of a light to shine a particular pattern on a curtain or other surface. We’re theater geeks, and it seemed like the perfect name for a product that lets you experiment with the effects of filtering what you see.</p>

          </div>
        </div>

        <div id="team" className="row colored-background green-background">
          <div className="col-lg-12 about-section">
            <h1 >Team</h1>
            <ul className="about-team">
              <li>Ethan Zuckerman, Director</li>
              <li>Rahul Bhargava, Project Manager</li>
              <li>Dennis Jen, Lead Developer</li>
              <li>Anna Chung, Researcher/Designer</li>
              <li>Alexis Hope, Designer</li>
              <li>Belén Carolina Saldías Fuentes, Machine Learning Researchers/System Designer</li>
              <li>Neil Gaikwad, Machine Learning Researchers/System Designer</li>
              <li>Jasmin Rubinovitz, Past Developer</li>
            </ul>
          </div>
        </div>

        <div id="press" className="row colored-background purple-background">
          <div className="col-lg-12 about-section">
            <h1>Press</h1>
            <h2>Check out some things that have been written on Gobo!</h2>
            <ul>
              <li>Anna Chung, <a href="https://onezero.medium.com/how-automated-tools-discriminate-against-black-language-2ac8eab8d6db">How Automated Tools Discriminate Against Black Language</a> (OneZero, Medium, 2/2019)</li>
              <li>Ethan Zuckerman, <a href="http://www.ethanzuckerman.com/blog/2018/12/09/we-make-the-media-a-recent-speech-at-freedom-of-speech-online-2018/">We Make the Media - a recent speech at Freedom of Speech Online 2018</a> (MIT Media Lab, Medium, 12/2018)</li>
              <li><a href="https://international.thenewslens.com/article/108378">Interview: MIT’s Ethan Zuckerman Says ‘Be Angry and Engage’</a> (The News Lens, 11/2018)</li>
              <li>Adam Piore, <a href="https://www.technologyreview.com/s/611826/technologists-are-trying-to-fix-the-filter-bubble-problem-that-tech-helped-create/">Technologists are trying to fix the filter bubble problem that tech helped to create</a> (MIT Technology Review, 8/2018)</li>
              <li>Ethan Zuckerman, <a href="https://medium.com/trust-media-and-democracy/six-or-seven-things-social-media-can-do-for-democracy-66cee083b91a">Six or seven things social media can do for democracy</a> (Trust, Media, and Democracy; Medium, 5/2018)</li>
              <li><a href="https://www.npr.org/2018/05/01/607321023/would-we-be-better-off-if-we-didnt-rely-on-1-social-network">Would We Be Better Off If We Didn't Rely On 1 Social Network?</a> (Morning Edition, NPR, 5/2018)</li>
              <li>Lauren Wamsley, <a href="https://www.npr.org/sections/thetwo-way/2018/05/01/607361849/as-facebook-shows-its-flaws-what-might-a-better-social-network-look-like">As Facebook Shows Its Flaws, What Might A Better Social Network Look Like?</a> (NPR, 5/2018)</li>
              <li>Tobias Rose-Stockwell, <a href="https://medium.com/s/story/how-to-fix-what-social-media-has-broken-cb0b2737128">How to Design Better Social Media</a> (Social Media, Medium, 4/2018)</li>
              <li>Rachel Metz, <a href="https://www.technologyreview.com/s/610576/how-to-manipulate-facebook-and-twitter-instead-of-letting-them-manipulate-you/">How to manipulate Facebook and Twitter instead of letting them manipulate you</a> (MIT Technology Review, 3/2018)</li>
              <li>Rachel Metz, <a href="https://www.technologyreview.com/s/610152/social-networks-are-broken-this-man-wants-to-fix-them/">Social Networks are Broken. This Man Wants to Fix Them</a> (MIT Technology Review, 2/2018)</li>
              <li>Ethan Zuckerman, <a href="https://www.theatlantic.com/technology/archive/2018/01/facebook-doesnt-care/551684/">Facebook Only Cares About Facebook</a> (The Atlantic, 1/2018)</li>
              <li>David Talbot, <a href="http://www.bostonmagazine.com/news/2017/11/12/ai-research-boston/">The Robots are Coming</a> (Boston Magazine, 11/2017)</li>
              <li>Ethan Zuckerman, <a href="https://medium.com/mit-media-lab/who-filters-your-news-why-we-built-gobo-social-bfa6748b5944">Who Filters Your News?” Why we built gobo.social</a> (MIT Media Lab, Medium, 11/2017)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

About.propTypes = {
  auth: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(About);
