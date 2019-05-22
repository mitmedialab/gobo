import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactSlider from 'react-slider';
import { Sparklines, SparklinesBars } from 'react-sparklines';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { updateRules, updateSettings, ruleChanged } from 'actions/feed';
import Input from 'components/Input/Input';
import SettingsItem from 'components/SettingsItem/SettingsItem';
import isEnabled, { KEYWORD_FILTER } from 'utils/featureFlags';
import { getFilterReasonIcon } from 'utils/filtering';
import { calculateBins } from 'utils/misc';
import MuteAllMenWhy from './MuteAllMenWhy';

const SPARKLINE_HEIGHT = 30;
const SPARKLINE_BINS = 30;
const SPARKLINE_STYLES = { strokeWidth: '1', fill: '#cccccc' };

class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      settings: { ...this.props.feed.settings },
      rules: [...this.props.feed.rules],
      openFilter: -1,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.feed.get_settings_success && nextProps.feed.get_settings_success) {
      this.setState({ settings: { ...nextProps.feed.settings } });
    }

    if (!this.props.feed.getRulesSuccess && nextProps.feed.getRulesSuccess) {
      this.setState({ rules: [...nextProps.feed.rules] });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.areSettingsChanged(prevState.settings, this.state.settings)) {
      this.props.dispatch(updateSettings(this.state.settings));
    }

    if (this.areRulesChanged(prevState.rules, this.state.rules)) {
      this.props.dispatch(updateRules(this.state.rules));
    }
  }

  areRulesChanged = (prevRules, currRules) => {
    let isChanged = false;

    if (prevRules.length === currRules.length) {
      prevRules.forEach((prev, i) => {
        const curr = currRules[i];
        if (curr.enabled !== prev.enabled) {
          isChanged = true;
        } else if (curr.levels !== prev.levels) {
          isChanged = true;
        }
      });
    } else {
      isChanged = true;
    }

    return isChanged;
  }

  areSettingsChanged = (prevSettings, currSettings) => {
    const keys = ['include_corporate', 'gender_filter_on',
      'virality_min', 'virality_max', 'gender_female_per',
      'rudeness_min', 'rudeness_max', 'seriousness_min',
      'seriousness_max'];

    if (isEnabled(KEYWORD_FILTER)) {
      keys.push('keywordsOr');
      keys.push('keywordsAnd');
    }

    let isChanged = false;
    keys.forEach((key) => {
      if (prevSettings[key] !== currSettings[key]) {
        isChanged = true;
      }
    });
    return isChanged;
  }

  handleDualSliderChange = (e, key) => {
    const settings = { ...this.state.settings };
    settings[`${key}_min`] = e[0];
    settings[`${key}_max`] = e[1];
    this.setState({ settings });
    this.props.dispatch(ruleChanged(key, 'slider', `(${e[0]},${e[1]})`));
  }

  handleCorporateChange = (e, key) => {
    const settings = { ...this.state.settings };
    settings[key] = !e.target.checked;
    this.setState({ settings });
    this.props.dispatch(ruleChanged('brands', 'hide', !settings[key]));
  }

  handleGenderChange = (e) => {
    this.handleChange(e, 'gender_female_per');
    this.props.dispatch(ruleChanged('gender', 'slider', e));
  }

  handleChange = (e, key) => {
    const settings = { ...this.state.settings };
    settings[key] = e;
    this.setState({ settings });
  }

  handleKeywordOrKeypress = (e) => {
    if (e.key === 'Enter') {
      const keywordsOr = e.target.value.length > 0 ? e.target.value.split(' ') : [];
      this.setState({
        settings: {
          ...this.state.settings,
          keywordsOr,
        },
      });
    }
  }

  handleKeywordAndKeypress = (e) => {
    if (e.key === 'Enter') {
      const keywordsAnd = e.target.value.length > 0 ? e.target.value.split(' ') : [];
      this.setState({
        settings: {
          ...this.state.settings,
          keywordsAnd,
        },
      });
    }
  }

  muteAllMen = () => {
    let ratio = 100;
    if (this.props.neutralFB && this.state.settings.gender_female_per === 100) {
      ratio = Math.round(this.props.neutralFB * 100);
    }
    this.handleChange(ratio, 'gender_female_per');
    this.props.dispatch(ruleChanged('gender', 'mute-all-men', ratio === 100));
  }

  openFilter = (index) => {
    this.setState({
      openFilter: index,
    });
  }

  closeFilter = () => {
    this.setState({
      openFilter: -1,
    });
  }

  seriousnessSetting = () => ({
    title: 'Seriousness',
    icon: getFilterReasonIcon('seriousness'),
    desc: 'Control the ratio of serious news to fun stuff in your feed.',
    key: 'news_score',
    longDesc: "Social media can be overwhelming, and sometimes it’s necessary to have a break from the news cycles. Gobo will run the text of each post -- and any articles linked to it -- through an algorithm that detects the topics it talks about. We created this algorithm ourselves, teaching it how to detect topics based on tags in a giant set of New York Times articles. It will mark each post with the topics it is about (sports, politics, pop culture, etc.), and we'll include or exclude posts based on the ratio that you set.",
    ruleCss: 'rule-setting',
    subtitle: (<span>Powered by <a href="https://mediacloud.org/" rel="noopener noreferrer" target="_blank">Media Cloud</a></span>),
    content: (
      <div>
        {this.props.feed.posts.length > 0 &&
          <div className="rule-sparklines">
            <Sparklines data={calculateBins(0, SPARKLINE_BINS, this.props.feed.posts, 'news_score')} height={SPARKLINE_HEIGHT}>
              <SparklinesBars style={SPARKLINE_STYLES} />
            </Sparklines>
          </div>
        }
        <div className="setting-with-sparklines rule-setting">
          <ReactSlider
            defaultValue={[0, 1]}
            min={0}
            max={1}
            step={0.01}
            withBars
            value={[this.state.settings.seriousness_min, this.state.settings.seriousness_max]}
            onAfterChange={e => this.handleDualSliderChange(e, 'seriousness')}
          />
          <div className="slider-labels">
            <span className="float-left"> Not serious</span>
            <span className="float-right"> Very serious</span>
          </div>
        </div>
      </div>
      ),
  })

  rudenessSetting = () => ({
    title: 'Rudeness',
    icon: getFilterReasonIcon('rudeness'),
    key: 'toxicity',
    desc: 'Filter out the trolls, or see how rude they are.',
    longDesc: (<span>Rude comments on social media have sadly become the norm. What if there was a way to hide these comments out of your feed? Gobo uses a Google algorithm to measure how "rude" a post is and lets you filter it out. Like most algorithms, this one exhibits questionable behaviour when it comes to race -- particularly in its <a href="https://onezero.medium.com/how-automated-tools-discriminate-against-black-language-2ac8eab8d6db" rel="noopener noreferrer" target="_blank">misidentification of African-American Vernacular English as being rude</a>.</span>),
    ruleCss: 'rule-setting',
    subtitle: (<span>Powered by <a href="https://perspectiveapi.com" rel="noopener noreferrer" target="_blank">Perspective</a></span>),
    content: (
      <div>
        {this.props.feed.posts.length > 0 &&
          <div className="rule-sparklines">
            <Sparklines data={calculateBins(this.state.settings.rudeness_min, SPARKLINE_BINS, this.props.feed.posts, 'rudeness')} height={SPARKLINE_HEIGHT}>
              <SparklinesBars style={SPARKLINE_STYLES} />
            </Sparklines>
          </div>
        }
        <div className="setting-with-sparklines rule-setting">
          <ReactSlider
            defaultValue={[0, 1]}
            min={0}
            max={1}
            step={0.01}
            withBars
            value={[this.state.settings.rudeness_min, this.state.settings.rudeness_max]}
            onAfterChange={e => this.handleDualSliderChange(e, 'rudeness')}
          />
          <div className="slider-labels">
            <span className="float-left"> Not rude</span>
            <span className="float-right"> Very rude</span>
          </div>
        </div>
      </div>
      ),
  })

  genderSetting = () => ({
    title: 'Gender',
    icon: getFilterReasonIcon('gender'),
    key: 'gender',
    desc: 'Change how much each gender is represented in your feed.',
    longDesc: 'Curious to see what your female or male friends are talking about? Want to try rebalancing your feed to 50/50 men and women? Or simply mute all men on your feed? Gobo uses a tool from the OpenGenderTracking project to detect what gender the author of a post is. We recognize that the algorithms for detecting gender exclude non-binary folks, but we include it here to imagine a way of rethinking gender representation on social media.',
    ruleCss: 'rule-setting',
    subtitle: (<span>Powered by <a href="http://opengendertracking.github.io/" rel="noopener noreferrer" target="_blank">OpenGenderTracking</a></span>),
    content: (
      <div>
        {(this.props.neutralFB !== null && this.props.neutralFB > 0) &&
          <div className="my-gender-ratio">
            You currently follow <span className="stat">{Math.round(this.props.neutralFB * 100)}%</span> women
          </div>}
        <div>
          <ReactSlider
            defaultValue={50}
            min={0}
            max={100}
            withBars
            value={this.state.settings.gender_female_per}
            onAfterChange={e => this.handleGenderChange(e)}
            className="slider bar-gender"
          />
          <div className="slider-labels">
            <span className="float-left"> {100 - this.state.settings.gender_female_per || '0'}% men</span>
            <span className="float-right"> {this.state.settings.gender_female_per || '0'}% women</span>
          </div>
          <div className="mute-men-wrapper slider-labels">
            <label htmlFor="mute-men">
              <Toggle
                name="mute-men"
                checked={this.state.settings.gender_female_per === 100}
                onChange={this.muteAllMen}
                icons={false}
                className="rule-toggle"
              />
              <span className="toggle-label">Mute all men. <MuteAllMenWhy /></span>
            </label>
          </div>
        </div>
      </div>
      ),
  })

  brandsSetting = () => ({
    title: 'Brands',
    icon: getFilterReasonIcon('corporate'),
    key: 'is_corporate',
    desc: 'Hide posts from brands to make your feed commercial-free.',
    longDesc: 'Want to limit your feed to the friends and family you actually care about? Brands are major players on social media platforms, often consuming large amounts of our feeds with either reposts or sponsored content. Gobo detects posts from brands and lets you hide them when you want. A limitation of our algorithm is that it doesn’t differentiate between corporations and non-profit organizations.',
    ruleCss: 'rule-setting',
    subtitle: 'Powered by Gobo',
    content: (
      <div className="slider-labels">
        <label htmlFor="corporate">
          <Toggle
            name="corporate"
            checked={!this.state.settings.include_corporate}
            onChange={(e) => { this.handleCorporateChange(e, 'include_corporate'); }}
            icons={false}
            className="rule-toggle"
          />
          <span className="toggle-label">Block all brands</span>
        </label>
      </div>
    ),
  })

  obscuritySetting = () => ({
    title: 'Obscurity',
    icon: getFilterReasonIcon('virality'),
    key: 'virality_count',
    desc: 'See the posts that arenʼt getting as much love.',
    longDesc: 'Social media sites prioritize the posts with the most shares and likes. So what are the posts that you might not being seeing? Gobo will look at the number of shares and likes each post has and include it or exclude it based on your settings.',
    ruleCss: 'rule-setting',
    subtitle: 'Powered by Gobo',
    content: (
      <div>
        {this.props.feed.posts.length > 0 &&
          <div className="rule-sparklines">
            <Sparklines data={calculateBins(0, SPARKLINE_BINS, this.props.feed.posts, 'virality_count')} height={SPARKLINE_HEIGHT}>
              <SparklinesBars style={SPARKLINE_STYLES} />
            </Sparklines>
          </div>
        }
        <div className="setting-with-sparklines rule-setting">
          <ReactSlider
            defaultValue={[0, 1]}
            min={0}
            max={1}
            step={0.01}
            withBars
            value={[this.state.settings.virality_min, this.state.settings.virality_max]}
            onAfterChange={e => this.handleDualSliderChange(e, 'virality')}
          />
          <div className="slider-labels">
            <span className="float-left"> Obscure </span>
            <span className="float-right"> Viral</span>
          </div>
        </div>
      </div>
      ),
  })

  keywordOrSetting = () => ({
    title: 'Any Keyword Filter (a.k.a. OR)',
    icon: 'icon-seriousness',
    desc: 'Enter to filter by any keywords. Space for multiple keywords. Blank to clear.',
    key: 'keywordOr',
    longDesc: 'Proof of Concept. Needs some UX',
    ruleCss: 'rule-setting',
    content: (
      <Input
        text="PoC - OR Keyword Filter"
        type="text"
        errorMessage="Invalid"
        emptyMessage="Can't be empty"
        handleKeypress={this.handleKeywordOrKeypress}
      />
    ),
  })

  keywordAndSetting = () => ({
    title: 'All Keyword Filter (a.k.a. AND)',
    icon: 'icon-seriousness',
    desc: 'Enter to filter by all keywords. Space for multiple keywords. Blank to clear.',
    key: 'keywordAnd',
    longDesc: 'Proof of Concept. Needs some UX',
    ruleCss: 'rule-setting',
    content: (
      <Input
        text="PoC - AND Keyword Filter"
        type="text"
        errorMessage="Invalid"
        emptyMessage="Can't be empty"
        handleKeypress={this.handleKeywordAndKeypress}
      />
    ),
  })

  handleKeywordRuleToggleChange = (e) => {
    const rules = this.state.rules.map(rule => ({ ...rule }));
    const ruleId = parseInt(e.target.name.split('-')[0], 10);
    const currentRule = rules.filter(rule => rule.id === ruleId)[0];
    currentRule.enabled = e.target.checked;
    this.setState({ rules });
    this.props.dispatch(ruleChanged(currentRule.title, 'hide', currentRule.enabled));
  }

  handleAdditiveRuleToggleChange = (e) => {
    const rules = this.state.rules.map(rule => ({ ...rule }));
    const tokens = e.target.name.split('-');
    const ruleId = parseInt(tokens[0], 10);
    const level = parseInt(tokens[1], 10);
    const currentRule = rules.filter(rule => rule.id === ruleId)[0];

    let levels = [];
    if (currentRule.levels) {
      levels = [...currentRule.levels];
    }
    if (e.target.checked) {
      levels.push(level);
    } else {
      levels = levels.filter(l => l !== level);
    }

    currentRule.levels = levels;
    this.setState({ rules });
    this.props.dispatch(ruleChanged(currentRule.title, currentRule.level_display_names[level], e.target.checked));
  }

  keywordRule = rule => ({
    title: rule.title,
    icon: getFilterReasonIcon('keyword'),
    desc: rule.description,
    key: `${rule.id}-${rule.title}`,
    longDesc: (<div>
      <p>Political news can be overwhelming! With 2020 coming up, election news is beginning to dominate the media. What if you could take a break from it? Gobo lets you hide posts about candidates running for the US 2020 Presidential election. We created a list of the current candidates, along with some other election-related phrases. Any post containing a word from this list is hidden from your feed.</p>
      <p>Hiding posts that contain any of these words:</p>
    </div>),
    longDescList: rule.exclude_terms,
    subtitle: `Powered by ${rule.creator_display_name}`,
    ruleCss: 'rule-setting',
    content: (
      <div className="slider-labels">
        <label htmlFor={`${rule.id}-${rule.title}`}>
          <Toggle
            checked={rule.enabled}
            name={`${rule.id}-${rule.title}`}
            onChange={this.handleKeywordRuleToggleChange}
            icons={false}
            className="rule-toggle"
          />
          <span className="toggle-label">Hide election posts</span>
        </label>
      </div>
    ),
  })

  handleRuleSlideChange = (level, ruleId) => {
    const rules = this.state.rules.map(rule => ({ ...rule }));
    const currentRule = rules.filter(rule => rule.id === ruleId)[0];
    currentRule.level = level;
    this.setState({ rules });
  }

  additiveRule = (rule) => {
    const levelToLinks = {};
    rule.level_display_names.forEach((level, i) => {
      const links = rule.links ? rule.links.filter(link => link.level === i) : [];
      levelToLinks[level] = links;
    });

    return {
      title: rule.title,
      icon: getFilterReasonIcon('additive'),
      desc: rule.description,
      key: `${rule.id}-${rule.title}`,
      longDesc: (
        <div>
          <p>{rule.long_description}</p>
          <p>{`${rule.title} sources:`}</p>
          {rule.level_display_names.map(level => (
            <React.Fragment key={`${rule.id}-${rule.title}-${level}-section`}>
              <p key={`${rule.id}-${rule.title}-${level}-description-title`} className="settings-rule-description-title">
                {level}
              </p>
              <ul key={`${rule.id}-${rule.title}-${level}`}>
                {levelToLinks[level].map(link => (<li key={`${rule.id}-${rule.title}-${level}-${link.id}`}>
                  <a href={link.uri} rel="noopener noreferrer" target="_blank" key={`${rule.id}-${rule.title}-${level}-${link.id}-link`}>
                    {link.name}
                  </a>
                </li>))}
              </ul>
            </React.Fragment>
            ))}
        </div>
      ),
      subtitle: rule.link ?
        (<React.Fragment>Curated by <a href={rule.link} rel="noopener noreferrer" target="_blank">{rule.creator_display_name}</a></React.Fragment>) : `Curated by ${rule.creator_display_name}`,
      ruleCss: 'rule-setting',
      content: (
        <div className="slider-labels additive-toggles">
          {rule.level_display_names.map((name, level) =>
            // eslint-disable-next-line react/no-array-index-key
            (<label htmlFor={`${rule.id}-${level}-${rule.title}`} key={`${rule.id}-${level}-${rule.title}-toggle-label`}>
              <Toggle
                checked={rule.levels ? rule.levels.filter(l => l === level).length === 1 : false}
                name={`${rule.id}-${level}-${rule.title}`}
                onChange={this.handleAdditiveRuleToggleChange}
                icons={false}
                className="rule-toggle"
              />
              <span className="toggle-label">{name}</span>
            </label>
            ))}
        </div>
      ),
    };
  }

  render() {
    const settings = [
      this.seriousnessSetting(),
      this.rudenessSetting(),
      this.genderSetting(),
      this.brandsSetting(),
      this.obscuritySetting(),
    ];

    if (isEnabled(KEYWORD_FILTER)) {
      settings.push(this.keywordOrSetting());
      settings.push(this.keywordAndSetting());
    }

    this.state.rules.forEach((rule) => {
      if (rule.type === 'keyword') {
        settings.push(this.keywordRule(rule));
      } else if (rule.type === 'additive') {
        settings.push(this.additiveRule(rule));
      }
    });

    return (
      <div className="settings-content">
        <ul className="settings-menu">
          <li>
            <header className="settings-header">
              <h1>Rules</h1>
            </header>
          </li>
          {settings.map((feature, index) => {
            const isOpen = ((this.state.openFilter !== -1) && (this.state.openFilter === index));
            return (
              <li className="setting-item filter" key={feature.key}>
                <SettingsItem
                  feature={feature}
                  isOpen={isOpen}
                  onClose={this.closeFilter}
                  onOpen={this.openFilter}
                  index={index}
                />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    feed: state.feed,
  };
}

Settings.propTypes = {
  dispatch: PropTypes.func.isRequired,
  neutralFB: PropTypes.number.isRequired,
  feed: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Settings);
