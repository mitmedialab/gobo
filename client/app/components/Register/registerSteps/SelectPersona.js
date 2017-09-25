import React, { Component } from 'react';
import { postPoliticalAffiliationToServer} from '../../../utils/apiRequests'

const political_enums = {
    'left': 1,
    'center left': 2,
    'center' : 3,
    'center right': 4,
    'right': 5
}




class SelectPersona extends Component {
    handleClick(num) {
        postPoliticalAffiliationToServer(num);
        this.props.onFinish()
    }
    render() {
        return (
            <div>
                <p>
                    To tailor your feed, tell us a little about what type of news you read.
                    <br/>
                    Scan the names of popular news sites below and click on the one you read most.
                    <br/>
                    This will help us tailor the news filter that we let you control.
                </p>
                <button className="button button_wide" onClick={()=>this.handleClick(political_enums['left'])}>
                    Huffington Post, MSNBC, Vox
                </button>

                <button className="button button_wide" onClick={()=>this.handleClick(political_enums['center left'])}>
                    NYTimes, BuzzFeed, Time
                </button>

                <button className="button button_wide" onClick={()=>this.handleClick(political_enums['center'])}>
                    The Hill, ABC News, Business Week
                </button>

                <button className="button button_wide" onClick={()=>this.handleClick(political_enums['center right'])}>
                    Examiner, National Review, US Chronicle
                </button>

                <button className="button button_wide" onClick={()=>this.handleClick(political_enums['right'])}>
                    Breitbart, Daily Caller, Fox News
                </button>

            </div>
        )
    }
}

export default SelectPersona;