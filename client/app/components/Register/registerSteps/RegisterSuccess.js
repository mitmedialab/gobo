import React from 'react';
import { Link } from 'react-router-dom';

const RegisterSuccess = () => (
  <div>
    <p className="registration-description">
      You are all set to start using Gobo!
      <br />
      Go ahead and check out your feed
      <br />
      You can click the settings button at any point to tweak your selections and control what you see.
    </p>
    <Link to="/feed">
      <button className="button button_wide" >Go to your feed</button>
    </Link>
  </div>
);

export default RegisterSuccess;
