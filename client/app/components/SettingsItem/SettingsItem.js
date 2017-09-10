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
        this.close = this.close.bind(this);

    }

    toggleOpen() {
        // if (!this.state.open) {
        //     this.filterElement.focus()
        // }
        this.setState ({
            open: !this.state.open
        })


    }

    close() {
        this.setState ({
            open: false
        })
    }
    render() {
        const openClass = this.state.open? "open" : ""
        return(
            <div className={"filter-content"}>
                <div className="filter-icon">
                    <span className={"filter-title-icon "+this.props.feature.icon} onClick={this.toggleOpen}></span>
                </div>
                <div className={"filter-inner "+ openClass} tabIndex="0" onBlur={ this.close }
                     ref={(el) => { this.filterElement = el; }}>
                    <div className="filter-title">
                        <span className="filter-title-text">{this.props.feature.title}</span>
                    {/*<i className="icon-sort"*/}
                       {/*onClick={()=>this.props.dispatch(sortBy(this.props.feature.key))}></i>*/}
                    </div>
                    <div className="filter-controls" onFocus={this.toggleOpen}>
                        {this.props.feature.content}
                    </div>
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