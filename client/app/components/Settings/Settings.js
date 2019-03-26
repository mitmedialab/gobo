import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactSlider from 'react-slider';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { updateRules, updateSettings } from 'actions/feed';
import Input from 'components/Input/Input';
import SettingsItem from 'components/SettingsItem/SettingsItem';
import isEnabled, { KEYWORD_FILTER, ADDITIVE_RULE } from 'utils/featureFlags';
import { getFilterReasonIcon } from 'utils/filtering';
import MuteAllMenWhy from './MuteAllMenWhy';


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
        } else if (curr.level !== prev.level) {
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
      'seriousness_max', 'echo_range'];

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
  }

  handleCheckBoxChange = (e, key) => {
    const settings = { ...this.state.settings };
    settings[key] = e.target.checked;
    this.setState({ settings });
  }

  handleInputChange = (e, key) => {
    const settings = { ...this.state.settings };
    settings[key] = ['anti-abortion'];
    this.setState({ settings });
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
    this.handleChange(100, 'gender_female_per');
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

  politicsSetting = () => ({
    title: 'Politics',
    icon: getFilterReasonIcon('News Echo'),
    desc: 'See stories matching or challenging your political perspective.',
    key: 'echo_range',
    longDesc: 'Worried about your "echo chamber"? Gobo will let you choose to see posts from news sources similar to those that you already read, or if you want to see a "wider" set of news you can choose to include media sources that might challenge how you read about and see the world. Our algorithm curates these sources based on a left-right political spectrum in the U.S.',
    content: (
      <div>
        <ReactSlider
          defaultValue={0}
          min={0}
          max={4}
          step={1}
          withBars
          value={this.state.settings.echo_range}
          onAfterChange={e => this.handleChange(e, 'echo_range')}
          className="slider politics"
        />
        <div className="slider-labels">
          <span className="pull-left">My perspective</span>
          <span className="pull-right">Lots of perspectives</span>
        </div>
      </div>
      ),
  })

  seriousnessSetting = () => ({
    title: 'Seriousness',
    icon: getFilterReasonIcon('Seriousness'),
    desc: 'Control the ratio of serious news to fun stuff in your feed.',
    key: 'news_score',
    longDesc: "Social media can be overwhelming, and sometimes it’s necessary to have a break from the news cycles. Gobo will run the text of each post, and any articles linked to, through an algorithm that detects topics it talks about. We've created this algorithm ourselves, teaching it the difference based on tags in a giant set of New York Times articles. It will mark each post with the topics it is about (sports, politics, pop culture, etc.) and then we'll include or exclude content based on the ratio that you set.",
    content: (
      <div>
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
          <span className="pull-left"> Not serious</span>
          <span className="pull-right"> Very serious</span>
        </div>
      </div>
      ),
  })

  rudenessSetting = () => ({
    title: 'Rudeness',
    icon: getFilterReasonIcon('Rudeness'),
    key: 'toxicity',
    desc: 'Filter out the trolls, or see just how rude they are.',
    longDesc: 'Want to enforce good manners on your feed? Rude and obnoxious behaviour on social media has sadly become the norm. Gobo uses a Google algorithm to measure how "rude" a post is, and lets you filter it out. Beware - like most algorithms this one exhibits questionable behaviour when it comes to race, particularly in its failure to account for African-American Vernacular English.',
    content: (
      <div>
        <div>
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
            <span className="pull-left"> Clean</span>
            <span className="pull-right"> Very rude</span>
          </div>
        </div>
      </div>
      ),
  })

  genderSetting = () => ({
    title: 'Gender',
    icon: getFilterReasonIcon('Gender'),
    key: 'gender',
    desc: 'Change how much each gender is represented in your feed.',
    longDesc: 'Curious to see what your female or male friends are talking about? Want to try rebalancing your feed to 50/50 men and women? Gobo will use a variety of techniques to detect what gender the author of a post is. We recognize that the algorithms for detecting gender discriminate against non-binary folks, and we include it here to invite criticism of Gobo and other social media platforms.',
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
            onAfterChange={e => this.handleChange(e, 'gender_female_per')}
            className="slider bar-gender"
          />
          <div className="slider-labels">
            <span className="pull-left"> {100 - this.state.settings.gender_female_per || '0'}% men</span>
            <span className="pull-right"> {this.state.settings.gender_female_per || '0'}% women</span>
          </div>
          <div className="mute-men-wrapper slider-labels">
            <label htmlFor="mute-men">
              <Toggle
                name="mute-men"
                checked={this.state.settings.gender_female_per === 100}
                onChange={this.muteAllMen}
                icons={false}
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
    icon: getFilterReasonIcon('Corporate'),
    key: 'is_corporate',
    desc: 'Filter out any brands from your feed to be commercial free.',
    longDesc: 'Want to limit your feed to the friends and family you actually care about? Brands are major players on social media platforms, often consuming large amounts of our feeds with either reposts or sponsored content that is featured. Gobo detects content from brands and lets you exclude them if you want to. At the moment, our algorithm doesn’t differentiate between corporations and non-profit organizations.',
    content: (
      <div className="slider-labels">
        <label htmlFor="corporate">
          <Toggle
            name="corporate"
            checked={this.state.settings.include_corporate}
            onChange={(e) => { this.handleCheckBoxChange(e, 'include_corporate'); }}
            icons={false}
          />
          <span className="toggle-label">Show content from brands</span>
        </label>
      </div>
    ),
  })

  obscuritySetting = () => ({
    title: 'Obscurity',
    icon: getFilterReasonIcon('Virality'),
    key: 'virality_count',
    desc: 'See the posts that aren’t getting as much love.',
    longDesc: 'Social media sites prioritize the posts with the most shares and likes. So what are the posts that you might not being seeing? Gobo will look at the number of shares and likes each post in your feed has and include it or exclude it based on your settings.',
    content: (
      <div>
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
          <span className="pull-left"> Obscure </span>
          <span className="pull-right"> Viral</span>
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

  handleRuleToggleChange = (e) => {
    const rules = this.state.rules.map(rule => ({ ...rule }));
    const ruleId = parseInt(e.target.name.split('-')[0], 10);
    const currentRule = rules.filter(rule => rule.id === ruleId)[0];
    currentRule.enabled = e.target.checked;
    this.setState({ rules });
  }

  keywordRule = rule => ({
    title: rule.title,
    icon: getFilterReasonIcon('Rule'),
    desc: rule.description,
    key: `${rule.id}-${rule.title}`,
    longDesc: 'Excluding posts that contain any of the words:',
    longDescList: rule.exclude_terms,
    subtitle: `Created by ${rule.creator_display_name}`,
    content: (
      <div className="slider-labels">
        <label htmlFor={`${rule.id}-${rule.title}`}>
          <Toggle
            checked={rule.enabled}
            name={`${rule.id}-${rule.title}`}
            onChange={this.handleRuleToggleChange}
            icons={false}
          />
          <span className="toggle-label">Activate rule</span>
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

  // TODO: need to enable or disable the slider based on the rule
  additiveRule = rule => ({
    title: rule.title,
    icon: getFilterReasonIcon('Rule'),
    desc: rule.description,
    key: `${rule.id}-${rule.title}`,
    longDesc: 'TBD',
    subtitle: `Created by ${rule.creator_display_name}`,
    content: (
      <div>
        <div className="slider-labels">
          <label htmlFor={`${rule.id}-${rule.title}`}>
            <Toggle
              checked={rule.enabled}
              name={`${rule.id}-${rule.title}`}
              onChange={this.handleRuleToggleChange}
              icons={false}
            />
            <span className="toggle-label">Activate rule</span>
          </label>
        </div>
        <ReactSlider
          defaultValue={0}
          min={0}
          max={rule.level_max}
          step={1}
          withBars
          value={rule.level}
          onAfterChange={e => this.handleRuleSlideChange(e, rule.id)}
          className="slider politics"
        />
        <div className="slider-labels">
          <span className="pull-left">{rule.level_display_names[0]}</span>
          <span className="pull-right">{rule.level_display_names[2]}</span>
        </div>
      </div>
    ),
  })

  render() {
    const settings = [
      this.politicsSetting(),
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
      if (rule.exclude_terms) {
        settings.push(this.keywordRule(rule));
      } else if (isEnabled(ADDITIVE_RULE)) {
        settings.push(this.additiveRule(rule));
      }
    });

    const arrowIcon = this.props.minimized ? 'left-open' : 'right-open';
    return (
      <div className="settings-content">
        <ul className="settings-menu">
          <li className="filter">
            <header className="settings-header">
              <span><button className="filter-toggle-btn" onClick={this.props.onMinimize}><span className={`arrow-icon icon-${arrowIcon}`} /><h1>Filters</h1></button></span>
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
  minimized: PropTypes.bool.isRequired,
  onMinimize: PropTypes.func.isRequired,
  feed: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Settings);
