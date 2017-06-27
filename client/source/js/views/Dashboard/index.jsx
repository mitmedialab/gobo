import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { testAction, testAsync } from 'actions/app';
import Icon from 'components/Global/Icon';
import bookImg from '../../../assets/img/book2.jpg';

@connect(state => ({
  asyncData: state.app.get('asyncData'),
  asyncError: state.app.get('asyncError'),
  asyncLoading: state.app.get('asyncLoading'),
  counter: state.app.get('counter'),
}))
export default class Dashboard extends Component {
  static propTypes = {
    asyncData: PropTypes.string,
    asyncError: PropTypes.object,
    asyncLoading: PropTypes.bool,
    counter: PropTypes.number,
    // from react-redux connect
    dispatch: PropTypes.func,
  }

  constructor() {
    super();

    this.handleAsyncButtonClick = this.handleAsyncButtonClick.bind(this);
    this.handleTestButtonClick = this.handleTestButtonClick.bind(this);
  }

  handleAsyncButtonClick() {
    const { dispatch } = this.props;

    dispatch(testAsync());
  }

  handleTestButtonClick() {
    const { dispatch } = this.props;

    dispatch(testAction());
  }

  render() {
    const {
      asyncData,
      asyncError,
      asyncLoading,
      counter,
    } = this.props;

    return (
      <div className='Dashboard'>
        <h1>Marvin</h1>
        <p>
          Boilerplate for kicking off React/Redux applications.
        </p>

        <hr />

        <h2>Examples</h2>

        <h3>Synchronous action</h3>
        <div className='Example'>
          <p>Counter: { counter }</p>
          <button onClick={ this.handleTestButtonClick }>
            Increase
          </button>
        </div>

        <h3>Async action example</h3>
        <div className='Example'>
          { asyncData && <p>{ asyncData }</p> }
          { asyncLoading && <p>Loading...</p> }
          { asyncError && <p>Error: { asyncError }</p> }
          <button
            disabled={ asyncLoading }
            onClick={ this.handleAsyncButtonClick }
          >
            Get async data
          </button>
        </div>

        <h3>Background image</h3>
        <div className='Example'>
          <div className='BackgroundImgExample' />
        </div>

        <h3>Image imported to the component</h3>
        <div className='Example'>
          <img src={ bookImg } alt='' className='ImgExample' />
        </div>

        <h3>SVG sprite icon set</h3>
        <div className='Example'>
          <Icon glyph='square' />
          <Icon glyph='circle' />
          <Icon glyph='triangle' />
        </div>
      </div>
    );
  }
}
