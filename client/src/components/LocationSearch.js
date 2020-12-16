import React from 'react';
import { LatLng, computeDistanceBetween } from 'spherical-geometry-js';

class LocationSearch extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            searchVal: "",
            eventSearchResult: null,
            venueSearchResult: null,
            validSearch: false,
            mapUrl: '',
            lat: undefined,
            long: undefined,
            search: false,
            distance: 5,
            venuesNearMe: [],
            eventsNearMe: [],
            noEvents: false,
            searchType: '1',
            statusMsg: "",
            subscribed: false
        }
        this.showNearMe();
    }

    updateUserLocation = (position) => {
        this.setState({ lat: position.coords.latitude, long: position.coords.longitude }, this.getVenuesNearMe)
    }

    computeDistance = () => {
        let from = new LatLng(this.state.lat, this.state.long)
        let to = new LatLng(this.state.searchResult.candidates[0].geometry.location.lat, this.state.searchResult.candidates[0].geometry.location.lng);
        let distance = computeDistanceBetween(from, to);
        return distance;
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

    handleSubmit = async (event) => {
        event.preventDefault();

        if (this.state.searchType === '1') {
            let res = await fetch('/venues/search/' + this.state.searchVal, {method: 'GET'});
            if (res.status === 200) {
                let data = JSON.parse(await res.text());
                this.setState({venueSearchResult: data});
            } else {
                this.setState({venueSearchResult: null})
            }
        } else {
            let res = await fetch('/events/search/' + this.state.searchVal, {method: 'GET'});
            if (res.status === 200) {
                let data = JSON.parse(await res.text())
                this.setState({eventSearchResult: data});
            } else {
                this.setState({eventSearchResult: null})
            }
        }
    }

    handleChange = (event) => {
        if (event.target.name === 'distance') {
            this.setState({ [event.target.name]: event.target.value }, this.getVenuesNearMe)
        } else if(event.target.name === 'searchType') {
            if (event.target.value === '1') {
                this.setState({[event.target.name]: event.target.value, eventSearchResult: null})
            } else {
                this.setState({[event.target.name]: event.target.value, venueSearchResult: null})
            }
        } else {
            this.setState({ [event.target.name]: event.target.value })
        }
    }

    displayResults = () => {
        return (
            <div>
                <div>Name: {this.state.searchResult.candidates[0].name}</div>
                <div>Address: {this.state.searchResult.candidates[0].formatted_address}</div>
                <div>Latitude: {this.state.searchResult.candidates[0].geometry.location.lat}</div>
                <div>Longitude: {this.state.searchResult.candidates[0].geometry.location.lng}</div>
            </div>
        )
    }

    showSearch = () => {
        this.setState({ search: true });
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
                this.setState({ venuesNearMe: JSON.parse(venues) }, this.getEventsNearMe)
            } else {
                this.setState({venuesNearMe: []})
            }
        }
    }

    getEventsNearMe = async () => {
        let events = []
        let noEventsFound = false;
        for (let venue of this.state.venuesNearMe) {
            for (let eventId of venue.eventIDs) {
                let res = await fetch('events/search/' + eventId.name, { method: 'GET' });
                if (res.status === 200) {
                    events.push(JSON.parse(await res.text()));
                }
            }
        }
        if (events.length === 0) {
            console.log('No events')
            noEventsFound = true;
        }
        this.setState({eventsNearMe: events, noEvents: noEventsFound})
    }

    showNearMe = async () => {
        this.getVenuesNearMe();
        this.setState({ search: false })
    }

    renderSearch = () => {
        return (
            <center>
                <form onSubmit={this.handleSubmit}>
                <label>Search Type:
                    <select name="searchType" value={this.state.searchType}
                            className="form-control form-center" onChange={this.handleChange}>
                            <option value="1">Venues</option>
                            <option value="2">Events</option>
                        </select>
                    </label>
                    <label>Enter a search
                        <input className="form-control form-text form-center"
                            name="searchVal"
                            type="text"
                            value={this.state.searchVal}
                            onChange={this.handleChange}>
                        </input>
                    </label>
                    <br></br>
                    <button className="btn btn-primary btn-color-theme" role="submit">Submit</button>
                </form>
                {this.state.eventSearchResult !== null ? <div>{this.state.eventSearchResult.name}</div> : null }
                {this.state.venueSearchResult !== null ? 
                    <div>{this.state.venueSearchResult.user.displayName}
                    {this.state.venueSearchResult.user.address}</div> : null }
            </center>
        )
        // return (
        //     <center>
        //         <form onSubmit={this.handleSubmit}>
        //             <label>Enter a search<br />
        //                 <input className="form-control form-text form-center"
        //                     name="searchVal"
        //                     type="text"
        //                     value={this.state.searchVal}
        //                     onChange={this.handleChange}>
        //                 </input>
        //             </label>
        //             <br />
        //             <button role="submit">Submit</button>
        //         </form>
        //         <div>User lat: {this.state.lat}</div>
        //         <div>User long: {this.state.long}</div>
        //         {this.state.validSearch ? this.displayResults() : null}
        //         <br></br>
        //         {this.state.validSearch && this.state.lat && this.state.long ? <div>Your distance from search: {this.computeDistance()} meters</div> : <div>Waiting for location data</div>}
        //         <iframe
        //             width="400"
        //             height="300"
        //             frameborder="0" style={{ border: 0 }}
        //             src={this.state.mapUrl} allowfullscreen>
        //         </iframe>
        //     </center>
        // )
    }

    computeMiles(venueLat, venueLong) {
        let from = new LatLng(this.state.lat, this.state.long)
        let to = new LatLng(venueLat, venueLong);
        let distance = computeDistanceBetween(from, to);
        return distance*0.000621371;
    }

    renderVenues = () => {
        let table = [];
        for (let venue of this.state.venuesNearMe) {
            table.push(
                <tr key={venue}>
                    <td>{venue.user.displayName}</td>
                    <td>{venue.streetAddress}</td>
                    <td>{this.computeMiles(venue.lat, venue.long)}</td>
                    <td><button onClick={() => this.subscribe(venue)}><span id={venue.user.displayName} className="fa fa-bookmark-o"></span></button></td>
                </tr>
            )
        }
        if (table.length > 0) {
            return table;
        } else {
            return (<div>No Nearby Venues Found :(</div>)
        }
    }

    renderVenuesTable = () => {
        return(
            <div className="padded-page">
              <h1></h1>
              <table className="table table-hover">
                <thead className="thead-light">
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Distance (in miles)</th>
                  <th>Subscribe</th>
                </tr>
                </thead>
                <tbody>
                  {this.renderVenues()}
                </tbody>
              </table>
            </div>
        );
    }

    subscribe = async (venue) => {
        let othermsg;
        if (this.props.accountType === "fan") {
            // unsubscribe
            if (this.props.accountObj.venues.includes(venue._id.toString())) {
                for ( var i = 0; i < this.props.accountObj.venues.length; i++){ 
                    if ( this.props.accountObj.venues[i] === venue._id.toString()) { 
                        this.props.accountObj.venues.splice(i, 1); 
                    }
                }
                if (!this.props.accountObj.venues.includes(venue._id.toString())) {
                    const othermsg = "Unsubscribed from " + venue.user.displayName;
                    document.getElementById(venue.user.displayName).className = "fa fa-bookmark-o"
                }
            }
            else { // subscribe
                this.props.accountObj.venues.push(venue._id.toString());
                if (this.props.accountObj.venues.includes(venue._id.toString())) {
                    const othermsg = "Successfully subscribed to " + venue.user.displayName + "!";
                    document.getElementById(venue.user.displayName).className = "fa fa-bookmark"
                }
            }
            // Push data to mongodb
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
                this.setState({statusMsg: othermsg});
            }
        }
        else {
            this.setState({statusMsg: "Oops! Please sign in on your Fan Account to subscribe to other Venues."});
        }
    }

    renderEvents = () => {
        let table = []
        for (let newEvent of this.state.eventsNearMe) {
            table.push(
                <tr>
                    <td>{newEvent.name}</td>
                    <td>{newEvent.time}</td>
                    <td>{newEvent.artists}</td>
                </tr>
            )
        }

        if (table.length > 0) {
            return table;
        } else if(this.state.noEvents){
            return (<div>No events were found</div>)
        } else {
            return (<div>Loading nearby events...</div>)
        }
    }

    renderEventsTable = () => {
        return(
            <div className="padded-page">
              <h1></h1>
              <table className="table table-hover">
                <thead className="thead-light">
                <tr>
                  <th>Name</th>
                  <th>Time</th>
                  <th>Artists</th>
                </tr>
                </thead>
                <tbody>
                  {this.renderEvents()}
                </tbody>
              </table>
            </div>
            );
    }

    renderNearMe = () => {
        return (
            <center>
                <label>Distance:
                <select name="distance" value={this.state.distance}
                        className="form-control form-center" onChange={this.handleChange}>
                        <option value="5">5 miles</option>
                        <option value="10">10 miles</option>
                        <option value="20">20 miles</option>
                        <option value="50">50 miles</option>
                    </select>
                </label>
                {this.renderVenuesTable()}
                <hr></hr>
                {this.renderEventsTable()}
            </center>
        )
    }

    render() {
        return (
            <div className="padded-page">
                <center>
                    <table>
                        <tr>
                            <th><button className="btn btn-primary btn-color-theme" disabled={!this.state.search} onClick={this.showNearMe}>Near me</button></th>
                            <th><button className="btn btn-primary btn-color-theme" disabled={this.state.search} onClick={this.showSearch}>Search</button></th>
                        </tr>
                    </table>
                </center>
                {this.state.search ? this.renderSearch() : this.renderNearMe()}
            </div>
        )
    }
}

export default LocationSearch;