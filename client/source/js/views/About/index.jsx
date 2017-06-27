import React, { Component } from 'react';

export default class About extends Component {
  render() {
    return (
      <div className='About'>
        <h1>About Marvin</h1>

        <p>
          Marvin is internal project by <a href='https://work.co'>Work & Co</a>.
          We love React and use it a lot. So Marvin is meant to be a starting point
          for our React projects. But as we love open source too, it is publicly
          available for anyone interested in using it.
        </p>
        <p>
          Visit documentation
          on <a href='https://github.com/workco/react-redux-webpack2-boilerplate'>GitHub</a>
        </p>
      </div>
    );
  }
}
