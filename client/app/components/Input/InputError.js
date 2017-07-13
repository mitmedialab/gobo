import React, { Component } from 'react';
import { makeClassList } from 'utils/misc'



class InputError extends Component {

    constructor(props) {
        super(props);
        var valid = (this.props.isValid && this.props.isValid()) || true;
        this.state = {
            message: 'Input is invalid'
        };
    }

    render(){
        var errorClass = makeClassList({
            'error_container':   true,
            'visible':           this.props.visible,
            'invisible':         !this.props.visible
        });

        return (
            <div className={errorClass}>
                <span>{this.props.errorMessage}</span>
            </div>
        )
    }

}

export default InputError