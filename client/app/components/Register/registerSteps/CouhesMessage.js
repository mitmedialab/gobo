import React, { Component } from 'react';

class CouhesMessage extends Component {
    render() {
        return (
            <div>
                <p>
                    COUHES Message Here
                </p>
                <button className="button button_wide" onClick={this.props.onFinish}>I Agree</button>
            </div>
        )
    }
}

export default CouhesMessage