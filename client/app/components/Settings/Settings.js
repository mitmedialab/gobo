import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';


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
        const toggleClassName = this.state.open? "accordion-toggle" : "accordion-toggle collapsed";
        const controlsClassName = this.state.open? "setting-controls collapse in" : "setting-controls collapse";
        return(
        <div>
            <a className={toggleClassName} onClick={this.toggleOpen}>
                <span className="caret"></span>
                <span className="sidebar-title">{this.props.feature.title}</span>
                <span className="sb-menu-icon glyphicon glyphicon-home"></span>
            </a>
            <ul className={controlsClassName} aria-expanded={this.state.open}>
                {this.props.feature.content}
            </ul>
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
                    <button className="button active" onClick={()=>this.props.onButtonClick()}>
                        {this.props.sortByToxicity? "don't" : ""} sort by Toxicity
                    </button>
                )

            },
            {
                title:'Gender',
                content: (
                    <ul>
                        <li>news</li>
                        <li>echo</li>
                    </ul>
                )

            },
            {
                title:'Corporate',
                content: (
                    <ul>
                        <li>news</li>
                        <li>echo</li>
                    </ul>
                )

            },
            {
                title:'Virality',
                content: (
                    <ul>
                        <li>news</li>
                        <li>echo</li>
                    </ul>
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
                <header className="settings-header">
                    <h1>Filters</h1>
                </header>

                <ul className="settings-menu">
                    {settings.map(feature=>(
                    <li className="setting-item" key={feature.title}>
                        <SettingsItem feature={feature}/>

                    </li>))}
                </ul>

                <button> update your filters </button>

            </div>
        );
    }
}

Settings.propTypes = propTypes;
export default Settings;