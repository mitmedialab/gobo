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
            settings: this.props.feed.settings
    }
        this.handleChange = this.handleChange.bind(this);
        this.muteAllMen = this.muteAllMen.bind(this);
        this.updateSettings = this.updateSettings.bind(this);
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

    updateSettings() {
        this.props.dispatch(updateSettings(this.state.settings))
    }

    render() {
        const settings = [
            {
                title:'Rudeness',
                icon: 'icon-toxicity',
                key: 'toxicity',
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
                title:'Corporate',
                icon: 'icon-corporate',
                key: 'is_corporate',
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
                            Show content from corporates
                            </label>
                        </span>

                    </div>
                )

            },
            {
                title:'Virality',
                icon: 'icon-virality',
                key: 'virality_count',
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
            {
                title:'News Echo',
                icon: 'icon-echo',
                content: (
                    <div>
                        TBD
                    </div>
                )
            }
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
                    {settings.map(feature=>(
                    <li className="setting-item filter" key={feature.title}>
                        <SettingsItem feature={feature}/>

                    </li>))}
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