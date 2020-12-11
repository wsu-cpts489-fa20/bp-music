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
        console.log(this.props.overObj);
        return (
        <div className="padded-page">
            <EventsTable
            rounds={this.props.overObj.eventIDs}
            />
        </div>
        );
    }   
}

export default FeedPage;