import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Load all icons
const svgIcons = require.context('../../../assets/icons', false, /.*\.svg$/);

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

const icons = requireAll(svgIcons).reduce(
  (state, icon) => ({
    ...state,
    [icon.default.split('#')[1].replace('-usage', '')]: icon.default,
  }),
  {}
);

export default class Icon extends Component {
  render() {
    const {
      className,
      width,
      height,
      glyph,
      style,
    } = this.props;

    const combinedClassName = className ? `Icon Icon--${ glyph } ${ className }` : `Icon Icon--${ glyph }`;

    return (
      <svg
        style={ style }
        className={ combinedClassName }
        width={ parseInt(width, 10) }
        height={ parseInt(height, 10) }
      >
        <use xlinkHref={ icons[glyph] } />
      </svg>
    );
  }
}

Icon.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  glyph: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

Icon.defaultProps = {
  height: 24,
  width: 24,
};
