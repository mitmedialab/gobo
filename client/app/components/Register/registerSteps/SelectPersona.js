import React, { Component } from 'react';
import { postPoliticalAffiliationToServer} from '../../../utils/apiRequests'


class SelectPersona extends Component {
    handleClick(num) {
        postPoliticalAffiliationToServer(num);
        this.props.onFinish()
    }
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
                <button className="button button_wide" onClick={()=>this.handleClick(1)}>Left</button>
                <button className="button button_wide" onClick={()=>this.handleClick(2)}>Center Left</button>
                <button className="button button_wide" onClick={()=>this.handleClick(3)}>Center</button>
                <button className="button button_wide" onClick={()=>this.handleClick(4)}>Center Right</button>
                <button className="button button_wide" onClick={()=>this.handleClick(5)}>Right</button>

            </div>
        )
    }
}

export default SelectPersona;