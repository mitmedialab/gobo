import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';


const propTypes = {
    changeSettings: PropTypes.func,
};


class Settings extends Component {

    render() {
        return (
            <div className="settings-panel">
                <h1>Settings</h1>
                <div>This is the settings part!</div>

                <button className="button active" onClick={()=>this.props.onButtonClick()}>
                    {this.props.sortByToxicity? "don't" : ""} sort by Toxicity
                </button>
            </div>
        );
    }
}

Settings.propTypes = propTypes;
export default Settings;