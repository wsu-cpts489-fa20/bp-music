import React from 'react';
import AppMode from './../AppMode.js';
import { LatLng, computeDistanceBetween } from 'spherical-geometry-js';

class CoursesPage extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            venueSearchResult: null,
            validSearch: false,
            lat: undefined,
            long: undefined,
            search: false,
            distance: 20,
            venuesNearMe: [],
            noEvents: false,
            statusMsg: "",
            submitBtnIcon: "fa fa-bookmark-o"
        }
    }    

    componentDidMount() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(this.updateUserLocation, function (err) {
                console.log('Geolocation error: ' + err);
            });
        } else {
            console.log("Geolocation Not Available");
        }
    }

    updateUserLocation = (position) => {
        this.setState({ lat: position.coords.latitude, long: position.coords.longitude }, this.getVenuesNearMe)
    }

    computeDistance(venueLat, venueLong) {
        let from = new LatLng(this.state.lat, this.state.long)
        let to = new LatLng(venueLat, venueLong);
        let distance = computeDistanceBetween(from, to);
        return distance*0.000621371;
    }

    // Called as soon as user location data is recieved
    getVenuesNearMe = async () => {
        if (this.state.lat && this.state.long) {
            let res = await fetch('/venues/nearme/' + this.state.distance, {
                method: 'POST',
                body: JSON.stringify({ lat: this.state.lat, long: this.state.long }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            if (res.status === 200) {
                let venues = await res.text()
                this.setState({ venuesNearMe: JSON.parse(venues) })
            } else {
                this.setState({ venuesNearMe: [] })
            }
        }
    }

    renderVenues = () => {
        let table = [];
        for (let venue of this.state.venuesNearMe) {
            table.push(
                <tr key={venue}>
                    <td>{venue.user.displayName}</td>
                    <td>{venue.streetAddress}</td>
                    <td>{this.computeDistance(venue.lat, venue.long)}</td>
                    <td><button onClick={() => this.subscribe(venue)}><span className="fa fa-bookmark-o"></span></button></td>
                </tr>
            )
        }
        if (table.length > 0) {
            return table;
        } else {
            return (<div>No Nearby Venues Found :(</div>)
        }
    }

    subscribe = async (venue) => {
        console.log(this.props.accountObj);
        console.log(this.props.accountObj._id);
        console.log(this.props.accountObj.user.id);
        if (this.props.accountType === "fan") {
            this.props.accountObj.venues.push(venue._id.toString());
            let data = {venues: this.props.accountObj.venues}
            const url = '/fans/' + this.props.accountObj.user.id
            const res = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                method: 'PUT',
                body: JSON.stringify(data)}); 
            const msg = await res.text();
            if (res.status != 200) {
                this.setState({statusMsg: msg});
            } else {
                this.setState({statusMsg: "Successfully subscribed to " + venue.user.displayName + "!"});
            }
        }
        else {
            this.setState({statusMsg: "Oops! Please sign in on your Fan Account to subscribe to other Venues."});
        }
    }

    closeStatusMsg = () => {
        this.setState({statusMsg: ""});
    }

    render() {
        return (
            <div className="padded-page">
            <h1>Your Venues</h1>
            <table className="table table-hover">
              <thead className="thead-light">
              <tr>
                <th></th>
              </tr>
              </thead>
              <tbody>
                
              </tbody>
            </table>
            {this.state.statusMsg != "" ? <div className="status-msg">
              <span>{this.state.statusMsg}</span>
              <button className="modal-close" onClick={this.closeStatusMsg}>
                  <span className="fa fa-times"></span></button></div> : null}
          </div>
        );
    }   
}

export default CoursesPage;