import React from 'react';
import { async } from 'regenerator-runtime';
import Checkbox from './Checkbox.js'

// Constant lists that currently populate the checkbox data, needs to get replaced by a GET from artist/venue/event MongoDB document
const genreList = [
    'Pop',
    'Hip Hop',
    'Rap',
    'Rock',
    'EDM',
    'Country',
    'RnB',
    'Metal'
];
const artistList = [
    'Post Malone',
    'Ariana Grande', 
    'Taylor Swift',
    'Kanye West',
    'Jay-Z',
    'Lil Wayne', 
    'Nicki Minaj',
    'Snoop Dog'
];
const venueList = [
    'Red Rocks Park and Amphitheatre',
    'Hollywood Bowl',
    'Merriweather Post Pavilion',
    'The Showbox',
    'The Underground'
]

class FanAccount extends React.Component {
    constructor(props) {
        super(props);
        this.origAccountInfo = null;
        //Create a ref for the Time input DOM element
        this.state = {
            url: '',
            genres: [],
            venues: [],
            artists: [],
            // State variables for checkboxes
            genreCheckboxes: genreList.reduce(
                (options, option) => ({
                  ...options,
                  [option]: false
                }), {})
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
        console.log("id is " + this.props.userId);
        let userData = {
            fanId: this.props.userId,
            genres: this.props.genres,
            venues: this.props.venues,
            artists: this.props.artists
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
                let fanData = {
                    eventIDs : userData
                    //eventIDs : this.state.name
                }
                console.log(fanData);
                let res2;
                res2 = await fetch(("/fans/" + this.props.userId), {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                        },
                    method: 'PUT',
                    body: JSON.stringify(fanData)});
                console.log(res2);
            }
        }
        // Functions to handle checkboxe changes genre/artist/venue
        // handleFanGenres = () => {
        //     Object.keys(this.state.genreCheckboxes).filter(checkbox => this.state.genreCheckboxes[checkbox]).forEach(checkbox => {
        //         console.log(checkbox, "is selected and being stored to fan account.");
        //         this.state.genres.push(checkbox);
        //     });
        // }
        
        handleGenreCheckboxChange = changeEvent => {
            const { name } = changeEvent.target;

            this.setState(prevState => ({
            genreCheckboxes: {
                ...prevState.genreCheckboxes,
                [name]: !prevState.genreCheckboxes[name]
            }
            }));
        };
        createGenreCheckbox = option => (
            <Checkbox
              label={option}
              isSelected={this.state.genreCheckboxes[option]}
              onCheckboxChange={this.handleGenreCheckboxChange}
              key={option}
            />
          );

    render() {
        return(
            <div className="modal" role="dialog" id="editFanDialog">
            {console.log(this.props.genres)}
            <div className="modal-dialog modal-lg"></div>
            <div className="modal-content form-center">
            <div className="modal-header">
            <h3><b>My Account</b></h3>
                <button className="modal-close" onClick={this.props.cancel}>&times;</button>
            </div>
            <div className="modal-body">
            <form onSubmit={this.props.cancel}>
            <br/>
            {console.log("This.props.genres: ", this.props.genres)}
            {console.log("This.props.userData.genres: ", this.userData.genres)}
            <label>
                Favorited Genres:
                {/*this.userData.genres.map(this.createGenreCheckbox)*/}
            </label>
            <br/>
            <label>
                Favorited Artists:
            </label>
                {/* <div>
                    {artists.map((favorite, index) => (
                        <div key={index} favorite={favorite} />
                    ))}
                </div> */}
            <br/>
            <label>
                Favorited Venues:
            </label>
                {/* <div>
                    {venues.map((favorite, index) => (
                        <div key={index} favorite={favorite} />
                    ))}
                </div> */}
            <br/>
            <button role="submit" id="fanAccountBtn" className="btn btn-primary btn-color-theme modal-submit-btn">
                &nbsp;Edit Fan Account</button>
            </form>
        </div></div></div>
        );
    }
}
export default FanAccount;