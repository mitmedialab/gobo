import React, { Component } from 'react';


class SelectPersona extends Component {
    render() {
        return (
            <div>
                <p>
                    Great! Almost done.
                    <br/>
                    Now just tell up what news you would like to see
                    <br/>
                    You can always go to your profile page and change that, or selct to see a wider view.
                </p>
                <button className="button button_wide" onClick={this.props.onFinish}>Left</button>
                <button className="button button_wide" onClick={this.props.onFinish}>Center Left</button>
                <button className="button button_wide" onClick={this.props.onFinish}>Center</button>
                <button className="button button_wide" onClick={this.props.onFinish}>Center Right</button>
                <button className="button button_wide" onClick={this.props.onFinish}>Right</button>

            </div>
        )
    }
}

export default SelectPersona;