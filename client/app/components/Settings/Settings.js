import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import ReactSlider from 'react-slider';


const propTypes = {
    changeSettings: PropTypes.func,
};

class SettingsItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
        this.toggleOpen = this.toggleOpen.bind(this);

    }

    toggleOpen() {
        this.setState ({
            open: !this.state.open
        })

    }
    render() {
        return(
        <div className="filter-content">
            <div className="filter-title">
                <span className="filter-title">{this.props.feature.title}</span>
                <span className="sb-menu-icon glyphicon glyphicon-home"></span>
            </div>
            <div className="filter-controls">
                {this.props.feature.content}
            </div>
        </div>
        )
    }
}

class Settings extends Component {

    render() {
        const settings = [
            {
                title:'Rudeness',
                icon: 'glyphicon-home',
                content: (
                    <div>
                        <div>
                            <ReactSlider defaultValue={[0, 1]} min={0} max={1} step={0.01} withBars />
                        </div>
                        <br/>
                        <br/>
                        <button className="button active" onClick={()=>this.props.onButtonClick()}>
                            {this.props.sortByToxicity? "don't" : ""} sort by Toxicity
                        </button>
                    </div>
                )

            },
            {
                title:'Gender',
                content: (
                    <div>
                        <ReactSlider defaultValue={50} min={0} max={100} withBars/>
                        <div>
                            <span style={{'float':'left'}}> 100% men</span>
                            <span style={{'float':'right'}}> 100% women</span>
                        </div>
                        <br/>
                        <br/>
                        <div>
                            <span><button></button> Mute all men</span>
                        </div>
                    </div>
                )

            },
            {
                title:'Corporate',
                content: (
                    <div>
                        <span>
                        <input
                                className="checkbox"
                                name="corporate"
                                type="checkbox"
                                checked={true}
                                onChange={console.log('corporate changed')} />
                            <label className="checkbox-label">
                            Show content from corporates
                            </label>
                        </span>

                    </div>
                )

            },
            {
                title:'Virality',
                content: (
                    <div>
                        <ReactSlider defaultValue={0.5} min={0} max={1} step={0.01} withBars />
                    </div>
                )

            },
            {
                title:'News Echo',
                content: (
                    <ul>
                        <li>news</li>
                        <li>echo</li>
                    </ul>
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
                         <button> update your filters </button>
                     </div>
                 </li>
                </ul>



            </div>
        );
    }
}

Settings.propTypes = propTypes;
export default Settings;