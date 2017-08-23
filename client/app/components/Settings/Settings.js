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

    }

    updateSettings() {
        this.props.dispatch(updateSettings(this.state.settings))
    }

    render() {
        const settings = [
            {
                title:'Rudeness',
                icon: 'glyphicon-home',
                key: 'toxicity',
                content: (
                    <div>
                        <div>
                            <ReactSlider defaultValue={[0, 1]} min={0} max={1} step={0.01} withBars
                                         value={[this.state.settings.rudeness_min, this.state.settings.rudeness_max]}
                                         onChange={e=>this.handleChange(e, 'rudeness', false, true)}/>
                        </div>
                    </div>
                )

            },
            {
                title:'Gender',
                key: 'gender',
                content: (
                    <div>
                        <span className="toggle">
                            <input type="checkbox"
                                   checked={this.state.settings.gender_filter_on}
                                   onChange={e=>this.handleChange(e, 'gender_filter_on', true, false)}
                            />
                            <label data-on="ON" data-off="OFF"></label>

                        </span>
                        {this.state.settings.gender_filter_on && <div>
                        <ReactSlider defaultValue={50} min={0} max={100} withBars
                                     disabled={!this.state.settings.gender_filter_on}
                                     value={this.state.settings.gender_female_per}
                                     onChange={e=>this.handleChange(e, 'gender_female_per', false, false)}
                                     className="slider bar-gender"/>
                        <div>
                            <span style={{'float':'left'}}> {100-this.state.settings.gender_female_per|| '0'}% men</span>
                            <span style={{'float':'right'}}> {this.state.settings.gender_female_per|| '0'}% women</span>
                        </div>
                        <br/>
                        <br/>
                        <div>
                            <span><input
                                className="checkbox"
                                name="mute-men"
                                type="checkbox"
                                checked={this.state.settings.gender_female_per==100 && this.state.settings.gender_filter_on}
                                disabled={!this.state.settings.gender_filter_on}
                                onClick={this.muteAllMen}
                            />
                            <label className="checkbox-label">
                            Mute all men
                            </label> </span>
                        </div>
                        </div>
                            }
                    </div>
                )

            },
            {
                title:'Corporate',
                key: 'is_corporate',
                content: (
                    <div>
                        <span>
                        <input
                                className="checkbox"
                                name="corporate"
                                type="checkbox"
                                checked={this.state.settings.include_corporate}
                                onChange={e=>this.handleChange(e, 'include_corporate', true)}/>
                            <label className="checkbox-label">
                            Show content from corporates
                            </label>
                        </span>

                    </div>
                )

            },
            {
                title:'Virality',
                key: 'virality_count',
                content: (
                    <div>
                        <ReactSlider defaultValue={[0, 1]} min={0} max={1} step={0.01} withBars
                                     value={[this.state.settings.virality_min, this.state.settings.virality_max]}
                                     onChange={e=>this.handleChange(e, 'virality', false, true)}/>
                    </div>
                )

            },
            {
                title:'News Echo',
                content: (
                    <div>
                        TBD
                    </div>
                )
            }
        ];
        return (
            <div className="settings-content">
                <ul className="settings-menu">
                    <li className="filter">
                        <header className="settings-header">
                            <h1>Filters</h1>
                        </header>
                    </li>
                    {settings.map(feature=>(
                    <li className="setting-item filter" key={feature.title}>
                        <SettingsItem feature={feature}/>

                    </li>))}

                 <li>
                     <div className="filter submit-button">
                         <button onClick={this.updateSettings}> update your filters </button>
                     </div>
                 </li>
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