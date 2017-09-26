import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { sortBy } from 'actions/feed';
import ReactModal from 'react-modal';

let modalStyles = {
    overlay : {
        position          : 'fixed',
            top               : 0,
            left              : 0,
            right             : 0,
            bottom            : 0,
            backgroundColor   : 'rgba(0, 0, 0, 0.8)',
            zIndex : '1000000'
    },
    content : {

            border                     : '1px solid #ccc',
            background                 : '#fff',
            overflow                   : 'auto',
            WebkitOverflowScrolling    : 'touch',
            borderRadius               : '4px',
            outline                    : 'none',
            padding                    : '20px',
            maxWidth: '500px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
    }

}

class SettingsItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
        }
        this.toggleOpen = this.toggleOpen.bind(this);
        this.close = this.close.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

    }

    toggleOpen() {
        if (this.props.isOpen) {
            this.close()
        }
        else {
            this.props.onOpen(this.props.index)
        }
    }

    openModal() {
        this.setState({
           modalOpen: true
        })
    }

    closeModal() {
        this.setState({
            modalOpen: false
        })
    }

    close() {
        this.props.onClose()
    }
    render() {
        const openClass = this.props.isOpen? "open" : ""
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
                    <div className="filter-description">
                        {this.props.feature.desc}. <a onClick={this.openModal}>Learn more</a>
                    </div>
                    <div className="filter-controls" onFocus={this.toggleOpen}>
                        {this.props.feature.content}
                    </div>
                </div>
                <ReactModal
                    isOpen={this.state.modalOpen}
                    onRequestClose={this.closeModal}
                    contentLabel={this.props.feature.desc}
                    style={modalStyles}
                >
                    <div className="filter-title">
                        <span className={"filter-title-icon "+this.props.feature.icon}></span>
                        <span className="filter-title-text">{this.props.feature.title}</span>
                    </div>
                    <div>
                        <i>{this.props.feature.desc}</i>
                    </div>
                    <div>
                        {this.props.feature.longDesc}
                    </div>
                    <div className="modal-close-button">
                        <button onClick={this.closeModal}>X</button>
                    </div>
                </ReactModal>
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