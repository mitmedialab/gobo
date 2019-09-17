import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import { openModal } from 'actions/feed';

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: '1000000',
  },
  content: {
    border: '1px solid #ccc',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px',
    maxWidth: '500px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minHeight: '300px',
    minWidth: '300px',
  },
};

class MuteAllMenWhy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openWhyModel: false,
    };
    this.openWhyModal = this.openWhyModal.bind(this);
    this.closeWhyModal = this.closeWhyModal.bind(this);
  }

  openWhyModal() {
    this.setState({
      openWhyModel: true,
    });
    this.props.dispatch(openModal('gender', 'why'));
  }

  closeWhyModal() {
    this.setState({
      openWhyModel: false,
    });
  }

  render() {
    return (
      <span>
        <a onClick={this.openWhyModal} role="button" tabIndex="0">{'  Why?'}</a>

        <ReactModal
          isOpen={this.state.openWhyModel}
          onRequestClose={this.closeWhyModal}
          contentLabel={'why "mute men"?'}
          style={modalStyles}
        >
          <div>
            <div className="filter-title">
              <span className="filter-title-text">Why do we have a "mute men" button?</span>
            </div>
            <p>
              Many have worried (and shown) that, like in the real world, men's voices tend to be over-represented on social media.
              The point of Gobo is to let you experience what it might be like if you could control your feed,
              and if people could build their own plug-ins to let you filter the content you see. Our "mute men"
              feels to us like a wonderfully provocative example of a feature you'd never see in a tool from Silicon Valley.
              We hope you take it as an illustrative example rather than as sexism.
            </p>
            <p>
              You're probably wondering why there is no "mute women" button? On many of our feeds that is sadly the default already.
            </p>
          </div>
          <div className="modal-close-button">
            <button onClick={this.closeWhyModal}>X</button>
          </div>
        </ReactModal>
      </span>
    );
  }
}

MuteAllMenWhy.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(MuteAllMenWhy);
