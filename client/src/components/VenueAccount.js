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
        console.log("id is " +this.props.userId);
        let userData = {
            venueId: this.props.userId,
            name: this.state.name,
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
            //console.log(res);
            //console.log(res.get('eventID'));
            if (res.status == 200) { //successful account creation!
                //Unsuccessful account creation
                //Grab textual error message
                const resText = await res.text();
                console.log("Something failed");
            }
            else{
                const resText = await res.text();
                console.log(resText);
                let venueData = {
                    //userId : this.props.venueID,
                    eventIDs : resText
                }
                console.log(venueData);
                let res2;
                res2 = await fetch(("/venues/" + this.props.userId), {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                        },
                    method: 'PUT',
                    body: JSON.stringify(venueData)});
                console.log(res2);
                }
            }

    /*appendID = async(event) => {

        let result = await fetch(this.state.url, {method: 'GET'});
    }*/

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