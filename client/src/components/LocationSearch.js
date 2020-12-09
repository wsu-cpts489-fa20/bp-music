import React from 'react';
import { LatLng, computeDistanceBetween } from 'spherical-geometry-js';

class LocationSearch extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            searchVal: "",
            eventSearchResult: {},
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
            console.log("Not Available");
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        if (this.state.searchType === '1') {

        } else {
            let res = await fetch('/events/search/' + this.state.searchVal, {method: 'GET'});
            if (res.status === 200) {
                let data = JSON.parse(await res.text())
                this.setState({eventSearchResult: data});
            } else {
                this.setState({eventSearchResult: {}})
            }
        }

        // if (result.status === 200) {
        //     let text = await result.text();
        //     let parsedText = JSON.parse(text);
        //     result = await fetch('map/' + parsedText.candidates[0].formatted_address);
        //     let mapUrl = await result.text();
        //     this.setState({ searchResult: JSON.parse(text), validSearch: true, mapUrl: mapUrl });
        // } else {
        //     this.setState({ searchResult: {}, validSearch: false, mapUrl: "" });
        // }
    }

    handleChange = (event) => {
        if (event.target.name === 'distance') {
            this.setState({ [event.target.name]: event.target.value }, this.getVenuesNearMe)
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
                let res = await fetch('events/' + eventId, { method: 'GET' });
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
                {this.state.eventSearchResult !== {} ? <div>{this.state.eventSearchResult.name}</div> : null}
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

    renderVenues = () => {
        let table = [];
        for (let venue of this.state.venuesNearMe) {
            table.push(
                <div>{venue.streetAddress}</div>
            )
        }
        if (table.length > 0) {
            return table;
        } else {
            return (<div>Loading nearby venues...</div>)
        }
    }

    renderEvents = () => {
        let table = []
        for (let newEvent of this.state.eventsNearMe) {
            table.push(
                <div>{newEvent.name}</div>
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
                {this.renderVenues()}
                <hr></hr>
                {this.renderEvents()}
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