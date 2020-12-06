import React from 'react';
import { LatLng, computeDistanceBetween } from 'spherical-geometry-js';

class LocationSearch extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            searchVal: "",
            searchResult: {},
            validSearch: false,
            mapUrl: '',
            lat: '',
            long: '',
            search: false,
            distance: 5
        }
    }

    updateUserLocation = (position) => {
        console.log(position)
        this.setState({ lat: position.coords.latitude, long: position.coords.longitude })
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
                console.log(err);
            });
        } else {
            console.log("Not Available");
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        let result = await fetch('location/' + this.state.searchVal)

        if (result.status === 200) {
            let text = await result.text();
            let parsedText = JSON.parse(text);
            result = await fetch('map/' + parsedText.candidates[0].formatted_address);
            let mapUrl = await result.text();
            this.setState({ searchResult: JSON.parse(text), validSearch: true, mapUrl: mapUrl });
        } else {
            this.setState({ searchResult: {}, validSearch: false, mapUrl: "" });
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
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

    showNearMe = () => {
        this.setState({ search: false })
    }

    renderSearch = () => {
        return (
            <center>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter a search<br />
                        <input className="form-control form-text form-center"
                            name="searchVal"
                            type="text"
                            value={this.state.searchVal}
                            onChange={this.handleChange}>
                        </input>
                    </label>
                    <br />
                    <button role="submit">Submit</button>
                </form>
                <div>User lat: {this.state.lat}</div>
                <div>User long: {this.state.long}</div>
                {this.state.validSearch ? this.displayResults() : null}
                <br></br>
                {this.state.validSearch && this.state.lat && this.state.long ? <div>Your distance from search: {this.computeDistance()} meters</div> : <div>Waiting for location data</div>}
                <iframe
                    width="400"
                    height="300"
                    frameborder="0" style={{ border: 0 }}
                    src={this.state.mapUrl} allowfullscreen>
                </iframe>
            </center>
        )
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
            </center>
        )
    }

    render() {
        return (
            <div className="padded-page">
                <center>
                    <table>
                        <tr>
                            <th><button className="btn btn-primary" disabled={!this.state.search} onClick={this.showNearMe}>Near me</button></th>
                            <th><button className="btn btn-primary" disabled={this.state.search} onClick={this.showSearch}>Search</button></th>
                        </tr>
                    </table>
                </center>
                {this.state.search ? this.renderSearch() : this.renderNearMe()}
            </div>
        )
    }
}

export default LocationSearch;