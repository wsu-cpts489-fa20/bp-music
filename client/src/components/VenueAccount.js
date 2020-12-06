import React from 'react';
import { async } from 'regenerator-runtime';

class VenueAccount extends React.Component {
    constructor(props) {
        super(props);
        this.origAccountInfo = null;
        //Create a ref for the Time input DOM element
        this.state = {
            url: '',
            name: '',
            venueID: '',
            time:'',
            artists:''
                    };
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
        this.setState({
            url:  '/events/' + this.state.name
        });
    }

    handleSubmit = async(event) => {
        event.preventDefault();
        let userData = {
            venueId: this.state.venueID,
            time: this.state.time,
            artists: this.state.artists
        };
        const url = this.state.url;
        let res;
            //use POST route to create new user account
            res = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                method: 'POST',
                body: JSON.stringify(userData)}); 
            if (res.status == 200) { //successful account creation!
                 //Unsuccessful account creation
                //Grab textual error message
                console.log("Something failed");
            }
    }

    render() {
        return(
            <div className="modal" role="dialog">
            <div className="modal-dialog modal-lg"></div>
            <div className="modal-content form-center">
            <div className="modal-header">
            <h3><b>Venue account, create an events!</b></h3>
                <button className="modal-close" onClick={this.props.cancel}>&times;</button>
            </div>
            <div className="modal-body">
            <form onSubmit={this.handleSubmit}>
            Event Name:
                    <input
                    className="form-control form-text form-center"
                    name="name"
                    id = "name"
                    type="text"
                    size="40"
                    required={true}
                    value={this.state.name}
                    onChange={this.handleChange}
                    />
            Venue:
                    <input
                    className="form-control form-text form-center"
                    name="venueID"
                    id = "venueID"
                    type="text"
                    size="40"
                    required={true}
                    value={this.state.venueID}
                    onChange={this.handleChange}
                    />
            Time:
                    <input
                    className="form-control form-text form-center"
                    name="time"
                    id="time"
                    type="text"
                    size="30"
                    required={true}
                    value={this.state.time}
                    onChange={this.handleChange}
                    />
            artists:
            <input
                    className="form-control form-text form-center"
                    name="artists"
                    id="artists"
                    type="text"
                    size="30"
                    required={true}
                    value={this.state.artists}
                    onChange={this.handleChange}
                    />
            <p></p>
            <button role="submit" id="venueSubmitBtn" className="btn btn-primary btn-color-theme modal-submit-btn">
                &nbsp;Create Event</button>
            </form>
            </div></div></div>
        );
    }
}
export default VenueAccount;