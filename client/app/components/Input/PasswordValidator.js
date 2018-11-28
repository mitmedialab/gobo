import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { makeClassList } from 'utils/misc';
import Icon from './Icon';

const propTypes = {
  minCharacters: PropTypes.string,
  requireCapitals: PropTypes.string,
  requireNumbers: PropTypes.string,
  forbiddenWords: PropTypes.array,
  name: PropTypes.string,
  visible: PropTypes.bool,
  valid: PropTypes.bool,
  validData: PropTypes.object,
};

class PasswordValidator extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: null,
      minCharacters: this.props.minCharacters,
      requireCapitals: this.props.requireCapitals,
      requireNumbers: this.props.requireNumbers,
      forbiddenWords: this.props.forbiddenWords,
      name: this.props.name,
    };
  }


  render() {
    const validatorClass = makeClassList({
      password_validator: true,
      visible: this.props.visible,
      invisible: !this.props.visible,
    });

    const forbiddenWords = this.state.forbiddenWords.map((word, i) => (
      <span key={i} className="bad_word">&ldquo;{word}&rdquo;</span>
    ));

    let validatorTitle;
    if (this.props.valid) {
      validatorTitle = (
        <h4 className="validator_title valid">
          {this.props.name} IS OK
        </h4>
      );
    } else {
      validatorTitle = (
        <h4 className="validator_title invalid">
          {this.props.name} RULES
        </h4>
      );
    }

    return (
      <div className={validatorClass}>
        <div className="validator_container">

          {validatorTitle}

          <ul className="rules_list">

            <li className={makeClassList({ valid: this.props.validData.minChars })}>
              <i className="icon_valid"> <Icon type="circle_tick_filled" /> </i>
              <i className="icon_invalid"> <Icon type="circle_error" /> </i>
              <span className="error_message">{this.state.minCharacters} characters minimum</span>
            </li>

            {/* <li className={makeClassList({'valid': this.props.validData.capitalLetters})}> */}
            {/* <i className="icon_valid"> <Icon type="circle_tick_filled"/> </i> */}
            {/* <i className="icon_invalid"> <Icon type="circle_error"/> </i> */}
            {/* <span className="error_message">Contains at least {this.state.requireCapitals} capital letter</span> */}
            {/* </li> */}

            <li className={makeClassList({ valid: this.props.validData.numbers })}>
              <i className="icon_valid"> <Icon type="circle_tick_filled" /> </i>
              <i className="icon_invalid"> <Icon type="circle_error" /> </i>
              <span className="error_message">Contains at least {this.state.requireNumbers} number</span>
            </li>

            <li className={makeClassList({ valid: this.props.validData.words })}>
              <i className="icon_valid"> <Icon type="circle_tick_filled" /> </i>
              <i className="icon_invalid"> <Icon type="circle_error" /> </i>
              <span className="error_message">Can&rsquo;t be {forbiddenWords}</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

PasswordValidator.propTypes = propTypes;

export default PasswordValidator;
