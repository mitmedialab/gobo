import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { updateSettings } from 'actions/feed';

import SettingsItem from 'components/SettingsItem/SettingsItem'

import ReactSlider from 'react-slider';

const propTypes = {
    dispatch: PropTypes.func,

};

class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            settings: this.props.feed.settings,
            openFilter: -1
    }
        this.handleChange = this.handleChange.bind(this);
        this.muteAllMen = this.muteAllMen.bind(this);
        this.updateSettings = this.updateSettings.bind(this);
        this.closeFilter = this.closeFilter.bind(this);
        this.openFilter = this.openFilter.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if (!this.props.feed.get_settings_success && nextProps.feed.get_settings_success) {
            this.setState({settings:nextProps.feed.settings })
        }
    }

    handleChange(e, key, is_bool, is_dual_slider) {
        const new_settings = this.state.settings;
        if (is_dual_slider){
            new_settings[key+'_min'] = e[0];
            new_settings[key+'_max'] = e[1];

        }
        else {
            new_settings[key] = is_bool ? e.target.checked : e;
        }
        this.setState({
            settings:new_settings
        })
    }
    muteAllMen() {
        const new_settings = this.state.settings;
        new_settings.gender_female_per = 100;
        this.setState({
            settings:new_settings
        })
        this.updateSettings();

    }

    openFilter(index) {
        this.setState({
            openFilter: index
        })
    }

    closeFilter() {
        this.setState( {
            openFilter: -1
        })
    }

    updateSettings() {
        this.props.dispatch(updateSettings(this.state.settings))
    }

    render() {
        const settings = [
            {
                title:'Politics',
                icon: 'icon-echo',
                desc: 'See stories matching or challenging your political point of view',
                key:'echo_range',
                longDesc: 'Worried about your "echo chamber"? Gobo will let you choose to see posts from news sources similar to those that you already read, or if you want to see a "wider" set of news you can choose to include media sources that might challenge how you read about and see the world.',
                content: (
                    <div>
                        <ReactSlider defaultValue={0} min={0} max={4} step={1} withBars
                                     value={this.state.settings.echo_range}
                                     onChange={e=>this.handleChange(e, 'echo_range', false, false)}
                                     className="slider politics"
                                     onAfterChange={()=>this.updateSettings()}/>
                        <div className="slider-labels">
                            <span style={{'float':'left'}}>Narrow view</span>
                            <span style={{'float':'right'}}>Wide view</span>
                        </div>
                    </div>
                )
            },

            {
                title:'Seriousness',
                icon: 'icon-seriousness',
                desc: 'Control the ratio of serious news to fun stuff in your feed',
                key: 'news_score',
                longDesc: 'Gobo will run the text of each post, and any articles linked to, through an algorithm that detects topics it talks about.  We\'ve created this algorithm ourselves, teaching it the difference based on tags in a giant set of New York Times articles.  It will mark each post with the topics it is about (sports, politics, pop culture, etc.) and then we\'ll include or exclude content based on the ratio that you set.',
                content: (
                    <div>
                        <ReactSlider defaultValue={[0, 1]} min={0} max={1} step={0.01} withBars
                                     value={[this.state.settings.seriousness_min, this.state.settings.seriousness_max]}
                                     onChange={e=>this.handleChange(e, 'seriousness', false, true)}
                                     onAfterChange={()=>this.updateSettings()}/>
                        <div className="slider-labels">
                            <span style={{'float':'left'}}> not serious</span>
                            <span style={{'float':'right'}}> very serious</span>
                        </div>
                    </div>
                )
            },

            {
                title:'Rudeness',
                icon: 'icon-toxicity',
                key: 'toxicity',
                desc: 'Filter out the trolls, or see just how rude they are',
                longDesc: 'Want to enforce good manners on your feed?  Rude and obnoxious behaviour on social media has sadly become the norm.  Gobo uses a Google algorithm to measure how "rude" a post is, and lets you filter it out.  Beware - like most algorithms this one exhibits questionable behaviour when it comes to race.',
                content: (
                    <div>
                        <div>
                            <ReactSlider defaultValue={[0, 1]} min={0} max={1} step={0.01} withBars
                                         value={[this.state.settings.rudeness_min, this.state.settings.rudeness_max]}
                                         onChange={e=>this.handleChange(e, 'rudeness', false, true)}
                                         onAfterChange={()=>this.updateSettings()}
                            />
                            <div className="slider-labels">
                                <span style={{'float':'left'}}> clean</span>
                                <span style={{'float':'right'}}> very rude</span>
                            </div>
                        </div>
                    </div>
                )

            },
            {
                title:'Gender',
                icon: 'icon-gender',
                key: 'gender',
                desc: 'Change how much each gender is represented in your feed',
                longDesc: 'Curious to see what your female or male friends are talking about? Want to try rebalancing your feed to 50/50 men and women?  Gobo will use a variety of techniques to detect what gender the author of a post is. The algorithms for detecting gender generally discriminate against non-binary folks. Don\'t take this as an affront to our non-binary friends, but rather as an attempt to highlight the limits of what they can do',
                content: (
                    <div>
                        <div>
                        <ReactSlider defaultValue={50} min={0} max={100} withBars
                                     value={this.state.settings.gender_female_per}
                                     onChange={e=>this.handleChange(e, 'gender_female_per', false, false)}
                                     className="slider bar-gender"
                                     onAfterChange={()=>this.updateSettings()}/>
                        <div className="slider-labels">
                            <span style={{'float':'left'}}> {100-this.state.settings.gender_female_per|| '0'}% men</span>
                            <span style={{'float':'right'}}> {this.state.settings.gender_female_per|| '0'}% women</span>
                        </div>
                        <br/>
                            <div>
                                (hint: set to {Math.round(this.props.neutralFB*100)|| 'X'}% women for no gender filtering)
                            </div>
                        <br/>
                        <div>
                            <span><input
                                className="checkbox"
                                name="mute-men"
                                type="checkbox"
                                checked={this.state.settings.gender_female_per==100}
                                onClick={this.muteAllMen}
                            />
                            <label className="checkbox-label">
                            Mute all men
                            </label> </span>
                        </div>
                        </div>
                    </div>
                )

            },
            {
                title:'Brands',
                icon: 'icon-corporate',
                key: 'is_corporate',
                desc: 'Filter out any brands from your feed to be commercial free',
                longDesc: 'Want to limit your feed to the friends and family you actually care about? Brands are major players on social media platforms, often consuming large amounts of our feeds with either reposts or sponsored content that is featured.  Gobo detects content from brands and lets you exclude them if you want to.',
                content: (
                    <div className="slider-labels">
                        <span>
                        <input
                                className="checkbox"
                                name="corporate"
                                type="checkbox"
                                checked={this.state.settings.include_corporate}
                                onChange={e=>{this.handleChange(e, 'include_corporate', true); this.updateSettings()}}/>
                            <label className="checkbox-label">
                            Show content from brands / organizations
                            </label>
                        </span>

                    </div>
                )

            },
            {
                title:'Virality',
                icon: 'icon-virality',
                key: 'virality_count',
                desc: 'See just the popular posts that are going viral',
                longDesc: 'Want to take a lunch break and watch cat videos?  Curious to see what is popular right now? Gobo will look at the number of shares and likes each post in your feed has and include it or exclude it based on your settings.  Social media sites do a similar thing with their "trending" topics; highlighting content that is growing in popularity.',
                content: (
                    <div>
                        <ReactSlider defaultValue={[0, 1]} min={0} max={1} step={0.01} withBars
                                     value={[this.state.settings.virality_min, this.state.settings.virality_max]}
                                     onChange={e=>this.handleChange(e, 'virality', false, true)}
                                     onAfterChange={()=>this.updateSettings()}/>
                        <div className="slider-labels">
                            <span style={{'float':'left'}}> not viral</span>
                            <span style={{'float':'right'}}> very viral</span>
                        </div>
                    </div>
                )

            },

        ];
        const arrowIcon = this.props.minimized?"left-open":"right-open";
        return (
            <div className="settings-content">
                <ul className="settings-menu">
                    <li className="filter">
                        <header className="settings-header">
                            <span><i className={"arrow-icon icon-"+arrowIcon} onClick={this.props.onMinimize}></i> <h1>Filters</h1></span>
                        </header>
                    </li>
                    {settings.map((feature, index)=> {
                        let isOpen = this.state.openFilter!=-1 && this.state.openFilter==index
                        return (
                            <li className="setting-item filter" key={feature.title}>
                                <SettingsItem feature={feature}
                                              isOpen={isOpen}
                                              onClose={this.closeFilter}
                                              onOpen={this.openFilter}
                                              index={index}/>

                            </li>)
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
Settings.propTypes = propTypes;
export default connect(mapStateToProps)(Settings);