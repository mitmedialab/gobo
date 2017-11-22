import React from 'react';
import PropTypes from 'prop-types';
import Photos from './Photos';

const propTypes = {
	media: PropTypes.array,
};

const Media = (props) => {
	switch (props.media[0].type) {
	case 'photo':
		return <Photos media={props.media} />;
	// case 'video':
	//     return <Video {...props} />
	// case 'animated_gif':
	//     return <Video gif={true} {...props} />
	default:
		return <div />;
	}
};

Media.propTypes = propTypes;

export default Media;
