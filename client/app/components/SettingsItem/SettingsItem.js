import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';

const DEFAULT_MODAL_STYLES = {
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
    borderRadius: '0',
    outline: 'none',
    padding: '20px',
    maxWidth: '500px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    right: 'unset',
    transform: 'translate(-50%, -50%)',
    minHeight: '300px',
    minWidth: '300px',
  },
};

class SettingsItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
    };
  }

  componentDidMount() {
    ReactModal.setAppElement('body');
  }

  toggleOpen = () => {
    if (this.props.isOpen) {
      this.close();
    } else {
      this.props.onOpen(this.props.index);
    }
  }

  openModal = () => {
    this.setState({ modalOpen: true });
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  }

  close = () => {
    this.props.onClose();
  }

  render() {
    const settingsInner = (
      <div className="filter-inner">
        <div className="filter-title">
          <span className="filter-title-text">{this.props.feature.title}</span>
        </div>
        {this.props.feature.subtitle &&
          <div className="filter-subtitle">
            <span className="filter-subtitle-text">{this.props.feature.subtitle}</span>
          </div>
        }
        <div className="filter-description">
          {this.props.feature.desc} <a onClick={this.openModal} tabIndex="0" role="button">Learn more</a>
        </div>
        <div className="filter-controls">
          {this.props.feature.content}
        </div>
      </div>
    );

    const settingsModalStyles = {
      overlay: {
        ...DEFAULT_MODAL_STYLES.overlay,
        top: '120px',
      },
      content: {
        ...DEFAULT_MODAL_STYLES.content,
        top: '5px',
        transform: 'translate(-50%, 0%)',
        bottom: 'unset',
        minHeight: 'unset',
      },
    };
    return (
      <div className={`filter-content ${this.props.feature.ruleCss}`}>
        <div className="filter-icon">
          <span className={`d-none d-lg-block filter-title-icon ${this.props.feature.icon}`} />
          <span className={`d-lg-none filter-title-icon ${this.props.feature.icon}`} tabIndex="0" role="button" onClick={this.toggleOpen} />
        </div>
        <span className="d-none d-lg-block">
          {settingsInner}
        </span>
        <ReactModal
          isOpen={this.props.isOpen}
          onRequestClose={this.close}
          contentLabel={this.props.feature.desc}
          style={settingsModalStyles}
        >
          {settingsInner}
        </ReactModal>
        <ReactModal
          isOpen={this.state.modalOpen}
          onRequestClose={this.closeModal}
          contentLabel={this.props.feature.desc}
          style={DEFAULT_MODAL_STYLES}
        >
          <div className="filter-title">
            <span className={`filter-title-icon filter-icon ${this.props.feature.ruleCss} ${this.props.feature.icon}`} />
            <span className="filter-title-text">{this.props.feature.title}</span>
          </div>
          <div className="filter-modal-description">
            <i>{this.props.feature.desc}</i>
          </div>
          <div>
            {this.props.feature.longDesc}
          </div>
          { this.props.feature.longDescList &&
            <ul>
              { this.props.feature.longDescList.map(item => <li key={`${item}`}>{item}</li>) }
            </ul>
          }
          <div className="modal-close-button">
            <button onClick={this.closeModal}>&#10005;</button>
          </div>
        </ReactModal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    feed: state.feed,
  };
}

SettingsItem.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  feature: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(SettingsItem);
