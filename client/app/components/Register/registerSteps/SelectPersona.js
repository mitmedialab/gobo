import React, { Component } from 'react';


class SelectPersona extends Component {
    render() {
        return (
            <div>
                <p>
                    Great! Almost done.
                    <br/>
                    Now just select your persona
                    <br/>
                    We will set your default settings to match that.
                    <br/>
                    You can always go to your settings page and change whatever you'd like.
                </p>
                <button className="button button_wide" onClick={this.props.onFinish}>Persona #1</button>
                <button className="button button_wide" onClick={this.props.onFinish}>Persona #2</button>
            </div>
        )
    }
}

export default SelectPersona;