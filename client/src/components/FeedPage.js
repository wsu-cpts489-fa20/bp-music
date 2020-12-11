import React from 'react';
import EventsTable from './EventsTable.js';
class FeedPage extends React.Component {
    constructor(props) {
        super(props);
        this.origAccountInfo = null;
        //Create a ref for the Time input DOM element
        this.state = {
            url: '',
            name: '',
            time:'',
            artists:''
                    };
    }

    render() {
        console.log("the userObj is" + this.props.userObj.accountType);
        return (
        <div className="padded-page">
             {(this.props.userObj.accountType === "venue") ? 
            <EventsTable
            rounds={this.props.overObj.eventIDs}
            />
            :null}
        </div>
        );
    }   
}

export default FeedPage;