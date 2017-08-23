import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { sortBy } from 'actions/feed';

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
                    <i className="icon-sort"
                       onClick={()=>this.props.dispatch(sortBy(this.props.feature.key))}></i>
                    <span className="sb-menu-icon glyphicon glyphicon-home"></span>
                </div>
                <div className="filter-controls">
                    {this.props.feature.content}
                </div>
            </div>
        )
    }
}
const propTypes = {
    dispatch: PropTypes.func,

};

function mapStateToProps(state) {
    return {
        feed: state.feed,
    };
}
SettingsItem.propTypes = propTypes;
export default connect(mapStateToProps)(SettingsItem);