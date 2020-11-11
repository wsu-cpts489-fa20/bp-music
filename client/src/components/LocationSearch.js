import React from 'react';

class LocationSearch extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            searchVal: "",
            key: 'AIzaSyArVAktWDvw8Ban4nGv1baEiaTt4CvcFTg'
        }
    }

    handleSubmit = async (event) => {
        // https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=YOUR_API_KEY
        
        // encode query string to ensure valid url
        let formattedSearch = encodeURIComponent(this.state.searchVal);

        const url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + 
        formattedSearch + 
        "&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=" + 
        this.state.key;
        console.log(url)
        // let result = await fetch(url)
        // console.log(result.status)
        // alert("Search: " + this.state.searchVal + "\n" + result);
        event.preventDefault();
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
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
                </center>
            </div>
        )
    }
}

export default LocationSearch;