import React from 'react';
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
        return distance;
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
                <tr>
                <td>{venue.user.displayName}</td>
                <td>{venue.streetAddress}</td>
                <td>{this.computeDistance(venue.lat, venue.long)}</td>
                <td><button onClick={this.state.subscribe}><span className="fa fa-bookmark-o"></span></button></td>
                </tr>
            )
        }
        if (table.length > 0) {
            return table;
        } else {
            return (<div>No Nearby Venues Found :(</div>)
        }
    }

    subscribe = () => {

    }

    render() {
        return (
            <div className="padded-page">
            <h1>Subscribe To Your Nearby Venues</h1>
            <table className="table table-hover">
              <thead className="thead-light">
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Distance (in meters)</th>
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
}

export default CoursesPage;