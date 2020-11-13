import React from 'react';

class LocationSearch extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            searchVal: "",
            searchResult: {},
            validSearch: false,
            mapUrl: ''
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
            this.setState({ searchResult: JSON.parse(text), validSearch: true, mapUrl: mapUrl});
        } else {
            this.setState({ searchResult: {}, validSearch: false, mapUrl: ""});
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

    render() {
        return (
            <div className="padded-page">
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
                    {this.state.validSearch ? this.displayResults() : null}
                    <iframe
                        width="400"
                        height="300"
                        frameborder="0" style={{border: 0}}
                        src={this.state.mapUrl} allowfullscreen>
                    </iframe> 
                </center>
            </div>
        )
    }
}

export default LocationSearch;