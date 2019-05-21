import React, { useEffect } from 'react';
import ReactGA from 'react-ga';

const withTracker = (WrappedComponent, options = {}) => {
  const trackPage = (page) => {
    ReactGA.set({
      page,
      ...options,
    });
    ReactGA.pageview(page);
  };

  const HOC = (props) => {
    useEffect(() => trackPage(props.location.pathname), [
      props.location.pathname,
    ]);

    return <WrappedComponent {...props} />;
  };

  return HOC;
};

export default withTracker;
