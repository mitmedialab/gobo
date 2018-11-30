import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles';

const propTypes = {
  media: PropTypes.array,
  gif: PropTypes.bool,
};

const Video = (props) => {
  const { media, gif } = props;
  let videoSrc = '';

  media[0].video_info.variants.forEach((v) => {
    if (v.url.indexOf('.mp4') > -1) {
      videoSrc = v.url;
    }
  });
  let VideoComponent = (
    <video src={videoSrc} controls={!gif} autoPlay={gif} loop={gif} style={styles.video}>
      {'Your browser does not support the '}<code>{'video '}</code>{'element.'}
    </video>
  );

  if (typeof window.videojs !== 'undefined') {
    VideoComponent = (
      // eslint-disable-next-line react/jsx-no-undef
      <VideoJS src={videoSrc} controls={!gif} autoPlay={gif} loop={gif} style={styles.video}>
        {'Your browser does not support the '}<code>{'video '}</code>{'element.'}
      </VideoJS>
    );
  }

  return (
    <div className="AdaptiveMedia" style={styles.AdaptiveMedia}>
      {VideoComponent}
      {gif ?
        <div className="AdaptiveMedia-badge" style={styles.AdaptiveMediaBadge}>
          GIF
        </div> : null}
    </div>
  );
};

Video.propTypes = propTypes;

export default Video;
