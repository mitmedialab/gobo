import React from 'react';

import isEnabled, { SCROLLY_TELLING } from 'utils/featureFlags';


const StaleFeed = () => {
  if (!isEnabled(SCROLLY_TELLING)) {
    return (<div />);
  }

  return (
    <div className="fluid-container landing-container">
      <div className="row">
        <div className="col-lg-12 about-section">
          <h1>TBD</h1>
          <p>
            TBD
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaleFeed;
