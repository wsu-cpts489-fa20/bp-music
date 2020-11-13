import React from 'react';
import ConfirmDeleteAccount from './ConfirmDeleteAccount.js';

class CreateEditAccountDialog extends React.Component {

    constructor(props) {
        super(props);
        this.origAccountInfo = null;
        //Create a ref for the email input DOM element
        this.newUserRef = React.createRef();
        this.repeatPassRef = React.createRef();
        this.profilePicRef = React.createRef();
        this.state = {accountName: "",
                      displayName: "",
                      profilePicURL: "https://icon-library.net//images/default-profile-icon/default-profile-icon-24.jpg",
                      password: "",
                      passwordRepeat: "",
                      securityQuestion: "",
                      securityAnswer: "",
                      accountType: "fan",
                      formUpdated: false,
                      confirmDelete: false,
                      showFanDialog: false};
    } 

    //componentDidMount -- If we are editing an existing user acccount, we need to grab the data from
    //the database and push them into the state.
    async componentDidMount() {
        if (!this.props.create) {
            //obtain current user data from database and push into state
            const url = "/users/" + this.props.userId;
            const res = await fetch(url);
            const json = await res.json();
            const userData = JSON.parse(json);
            this.origAccountInfo = userData; //This determines whether update can occur
            this.origAccountInfo.passwordRepeat = userData.password;
            this.setState({accountName: this.props.userId,
                           displayName: userData.displayName,
                           profilePicURL: userData.profilePicURL,
                           password: userData.password,
                           passwordRepeat: userData.password,
                           accountType: userData.accountType,
                           securityQuestion: userData.securityQuestion,
                           securityAnswer: userData.securityAnswer});
        }
    }

    //checkDataValidity -- Callback function invoked after a form element in
    //the 'Create Account' dialog box changes and component state has been
    //updated. We first check whether the passwords match. If they do not, 
    //we set a custom validity message to be displayed when the user clicks the
    //'Create Account' button. Otherwise, we reset the custom validity message
    //to empty so that it will NOT fire when the user clicks 'Create Account'.
    //Second, we check whether anything in the form changed from the original.
    //If so, we update the 'formUpdated' state var, so that the form's submit
    //button is enabled.
    checkDataValidity = () => {
        if (this.state.password != this.state.passwordRepeat) {
            //Passwords don't match
            this.repeatPassRef.current.setCustomValidity(
            "This password must match password entered in previous field.");
        } else {
            this.repeatPassRef.current.setCustomValidity("");
        }
    }

    //handleChange--Called when a field in a dialog box form changes.
    handleChange = (event) => {
        const formUpdated = (this.origAccountInfo == null ? true : this.formIsUpdated(event.target.name,event.target.value));
        if (event.target.name === "profilePic") {
            if (event.target.value.length == 0) { //The user canceled the file selection -- set back to default
                this.setState({profilePicURL: "https://icon-library.net//images/default-profile-icon/default-profile-icon-24.jpg",
                               formUpdated: formUpdated},
                               this.checkDataValidity);
            } else { //The user selected a file
                const self = this;
                const reader = new FileReader();
                reader.readAsDataURL(this.profilePicRef.current.files[0]);
                reader.addEventListener("load",function() {
                    self.setState({profilePicURL:  this.result,
                                   formUpdated: formUpdated},this.checkDataValidity);
                });
                
            }
        } else {
            this.setState({[event.target.name]: event.target.value,
                           formUpdated: formUpdated},this.checkDataValidity);
        }
    } 

    //formisUpdated-- Checks whether any form data element has changed from the original. If so, 
    //returns true. Returns false otherwise. Note that in case of editing new account, always returns
    //true since this.origAccountInfo is set to null.
    //Should be called whenever the user makes a change to form data.
    formIsUpdated = (updateField,updateVal) => {
        if (this.origAccountInfo[updateField] != updateVal) {return true;}
        if (updateField != "displayName" && 
             this.state.displayName != this.origAccountInfo.displayName) 
             {return true;}
        if (updateField != "profilePicURL" && 
             this.state.profilePicURL != this.origAccountInfo.profilePicURL) 
             {return true;}
        if (updateField != "password" &&
            this.state.password !== this.origAccountInfo.password)
            {return true;}
        if (updateField != "passwordRepeat" &&
            this.state.passwordRepeat !== this.origAccountInfo.passwordRepeat)
            {return true;}
        if (updateField != "securityQuestion" &&
            this.state.securityQuestion !== this.origAccountInfo.securityQuestion)
            {return true;}
        if (updateField != "securityAnswer" &&
            this.state.securityAnswer !== this.origAccountInfo.securityAnswer)
            {return true;}
        return false;
    }

    //setDefaultDisplayName -- Triggered by onBlur() event of Email field.
    //Sets default value of display name to value entered into Email field 
    //as a courtesy.
    setDefaultDisplayName = (event) => {
      if (event.target.value.length > 0 && this.state.displayName === "") {
        this.setState({displayName: event.target.value});
      }
    }

    //handleSubmit -- Triggered when user clicks on submit button to
    //either create or edit account.
    //Custom data checking ensures user account under this email does not 
    //already exist and that the rest of the info is valid. We create a new  
    // object for user, save it to localStorage and take user to app's 
    //landing page. 
    handleSubmit = async(event) => {
        this.setState({showFanDialog: false});
        event.preventDefault();
        //Initialize user account
        let userData = {
            displayName: this.state.displayName,
            password: this.state.password,
            profilePicURL: this.state.profilePicURL,
            securityQuestion: this.state.securityQuestion,
            securityAnswer: this.state.securityAnswer
        };
        const url = '/users/' + this.state.accountName;
        let res;
        if (this.props.create) { //use POST route to create new user account
            res = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                method: 'POST',
                body: JSON.stringify(userData)}); 
            if (res.status == 200) { //successful account creation!
                this.props.done("New account created! Enter credentials to log in.",false);
            } else { //Unsuccessful account creation
                //Grab textual error message
                const resText = await res.text();
                this.props.done(resText,false);
            }
        } else { //use PUT route to update existing user account
            res = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                method: 'PUT',
                body: JSON.stringify(userData)}); 
            if (res.status == 200) { //successful account creation!
                this.props.done("User Account Updated!",false);
            } else { //Unsuccessful account update
                //Grab textual error message
                const resText = await res.text();
                this.props.done(resText,false);
            }
        }
    }

    //deleteAccount -- Called after confirms account deletion. 
    //Uses DELETE server route to perform server deletion. 
    //Calls on done with status message and
    //true if delete was succesful, false otherwise.
    deleteAccount = async() => {
       const url = '/users/' + this.state.accountName;
       const res = await fetch(url, 
                    {method: 'DELETE'}); 
        if (res.status == 200) { //successful account deletion!
            this.props.done("Account '" + this.state.accountName + "' has been deleted.",true);
        } else { //Unsuccessful account deletion
            //Grab textual error message
            const resText = await res.text();
            this.props.done(resText,false);
        }
        this.setState({confirmDelete: false});
    }

    //confirmDeleteAccount -- Called when user clicks on "Delete Account..."
    //button to indicate intention to delete account. Presents the Confirm
    //Delete dialog box.
    confirmDeleteAccount = (e) => {
        e.preventDefault();
        this.setState({confirmDelete: true});
    }

renderFanDialog = () => {
    return (
        <div className="modal" role="dialog">
        <div className="modal-dialog modal-lg"></div>
        <div className="modal-content form-center">
        <div className="modal-header">
        <h3><b>Fan Account</b></h3>
            <button className="modal-close" onClick={this.props.cancel}>&times;</button>
        </div>
        <div className="modal-body">
            <form onSubmit={this.handleSubmit}>
                <br/>
                <label>
                    Genres:
                    <select name="genres[]" id="genres" onChange={this.handleGenres} multiple>
                        <option value="pop">Pop</option>
                        <option value="hip-hop">Hip-Hop</option>
                        <option value="rap">Rap</option>
                        <option value="rock">Rock</option>
                        <option value="edm">EDM</option>
                        <option value="country">Country</option>
                        <option value="rnb">R and B</option>
                        <option value="metal">Metal</option>
                    </select>
                </label>
                <br/>
                <label>
                    Artists:
                    <select name="artists[]" id="artists" onChange={this.handleArtists} multiple>
                        <option value="postMalone">Post Malone</option>
                        <option value="arianaGrande">Ariana Grande</option>
                        <option value="taylorSwift">Taylor Swift</option>
                        <option value="drake">Drake</option>
                        <option value="popSmoke">Pop Smoke</option>
                        <option value="lilWayne">Lil Wayne</option>
                        <option value="nickiMinaj">Nicki Minaj</option>
                        <option value="travisScott">Travis Scott</option>
                        <option value="kanyeWest">Kanye West</option>
                        <option value="jayZ">Jay-Z</option>
                        <option value="localArtist1">Local Artist 1</option>
                        <option value="localArtist2">Local Artist 2</option>
                    </select>
                </label>
                <br/>
                <label>
                    Venues:
                    <select name="avenues[]" id="venues" onChange={this.handleVenues} multiple>
                        <option value="redRocksParkAndAmpitheater">Red Rocks Park and Amphitheatre</option>
                        <option value="hollywoodBowl">Hollywood Bowl</option>
                        <option value="merriweatherPostPavilion">Merriweather Post Pavilion</option>
                        <option value="showbox">The Showbox</option>
                        <option value="underground">The Underground</option>
                        <option value="seamonsterLounge">Seamonster Lounge</option>
                        <option value="crocodile">The Crocodile</option>
                        <option value="venue1">Venue 1</option>
                        <option value="venue1">Venue 1</option>
                        <option value="venue2">Venue 2</option>
                        <option value="venue3">Venue 3</option>
                        <option value="venue4">Venue 4</option>
                        <option value="venue5">Venue 5</option>
                        <option value="venue6">Venue 6</option>
                        <option value="venue7">Venue 7</option>
                    </select>
                </label>
                <br/>
            </form>
        <button role="submit" className="btn btn-primary btn-color-theme modal-submit-btn">
            &nbsp;Create Fan Account</button>
        </div>
        </div>
        </div>
    );
}

    render() {
    return (  
    <div className="modal" role="dialog">
    <div className="modal-dialog modal-lg"></div>
        <div className="modal-content form-center">
            <div className="modal-header">
              <h3><b>{this.props.create ? "Create New Account" : "Edit Account"}</b></h3>
              <button className="modal-close" 
                       onClick={this.props.cancel}>
                &times;</button>
            </div>
            <div className="modal-body">
            <form onSubmit={this.handleAccountType}>
            <label>
                Email: 
                <input  
                autocomplete="off"
                disabled={!this.props.create}
                className="form-control form-text form-center"
                name="accountName"
                type="email"
                size="35"
                placeholder="Enter Email Address"
                pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
                required={true}
                ref={this.newUserRef}
                value={this.state.accountName}
                onChange={this.handleChange}
                onBlur={this.setDefaultDisplayName}
                />
            </label>
            <br/>
            <label>
                Password:
                <input
                autocomplete="off"
                className="form-control form-text form-center"
                name="password"
                type="password"
                size="35"
                placeholder="Enter Password"
                pattern=
                "(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
                required={true}
                value={this.state.password}
                onChange={this.handleChange}
                />
            </label>
            <br/>
            <label>
                Repeat Password:
                <input
                className="form-control form-text form-center"
                name="passwordRepeat"
                type="password"
                size="35"
                placeholder="Repeat Password"
                required={true}
                ref={this.repeatPassRef}
                value={this.state.passwordRepeat}
                onChange={this.handleChange}
                />
            </label>
            <br/>
            <label>
                Display Name:
                <input
                className="form-control form-text form-center"
                name="displayName"
                type="text"
                size="30"
                placeholder="Display Name"
                required={true}
                value={this.state.displayName}
                onChange={this.handleChange}
                />
            </label>
            <br/>
            <label>
                Profile Picture:<br/>
                <input
                className="form-control form-text form-center"
                name="profilePic"
                type="file"
                accept="image/x-png,image/gif,image/jpeg" 
                ref={this.profilePicRef}
                value={this.state.profilePic}
                onChange={this.handleChange}
                />
                <img src={this.state.profilePicURL != "" ? 
                            this.state.profilePicURL :
                            this.state.profilePicDataURL} 
                        height="60" width="60" 
                 />
            </label> 
            <br/>
            <label>
                Security Question:
                <textarea
                className="form-control form-text form-center"
                name="securityQuestion"
                size="35"
                placeholder="Security Question"
                rows="2"
                cols="35"
                maxLength="100"
                required={true}
                value={this.state.securityQuestion}
                onChange={this.handleChange}
                />
            </label>
            <br/>
            <label>
                Answer to Security Question:
                <textarea
                className="form-control form-text form-center"
                name="securityAnswer"
                type="text"
                placeholder="Answer"
                rows="2"
                cols="35"
                maxLength="100"
                required={true}
                value={this.state.securityAnswer}
                onChange={this.handleChange}
                />
            </label>
            <br/>
            <label>Account Type:
            <select name="type" value={this.state.accountType} 
                className="form-control form-textform-center" 
                onChange={this.handleChange}>
                <option value="fan">Fan</option>
                <option value="artist">Artist</option>
                <option value="venue">Venue</option>
            </select> 
            </label>
            <br/>
            {!this.props.create ?  
            <button className="btn btn-small btn-danger" onClick={this.confirmDeleteAccount}>
                Delete Account...
            </button> : null}
            <br/><br/>
            <button role="submit" 
                disabled={!this.state.formUpdated}
                className="btn btn-primary btn-color-theme modal-submit-btn">
                <span className={this.props.create ? "fa fa-user-plus" : "fa fa-user"}></span>
                &nbsp;{this.props.create ? "Create Account" : "Update Account"}
            </button>
            </form>
            </div>
        </div>
        {this.state.confirmDelete ? 
          <ConfirmDeleteAccount email={this.state.accountName}
                                deleteAccount={this.deleteAccount}
                                close={() => (this.setState({confirmDelete: false}))}
         /> : null}
         {this.state.showFanDialog ? this.renderFanDialog() : null}
    </div>
    );
}
handleAccountType = () => {
    if (this.state.accountType == "fan") {
        this.setState({showFanDialog: true});
        this.setState({showFanDialog: true,
            genres: [],
            artists: [],
            venues: []});
    }
    if (this.state.accountType == "artist") {
        this.setState({showArtistDialog: true});
        this.setState({showArtistDialog: true,
            artistName: "",
            genres: [],
            instagram: "",
            facebook: ""});
    }
    if (this.state.accountType == "venue") {
        this.setState({showVenueDialog: true});
    }
}

handleGenres = () => {
    this.state.genres = document.getElementById("genres").selectedOptions;
}

handleArtists = () => {
    this.state.genres = document.getElementById("artists").selectedOptions;
}

// handleFanArtistResults = () => {
//     var artistBasedOnGenreList = {
//         "pop": ["Post Malone", "Ariana Grande", "Taylor Swift", "Drake", "Ed Sheeren"],
//         "hip-hop": ["Post Malone", "Ariana Grande", "Travis Scott", "Pop Smoke", "Drake","Ed Sheeren"],
//         "rap": ["Kanye West", "Jay-Z", "Lil Wayne", "Nicki Minaj", "Snoop Dog"],
//         "rock": ["Taylor Swift", "AC/DC", "Foo Fighters", "Queen"],
//         "edm": ["Skrillix", "Marshmellow", "Deadmau5"],
//         "country": ["Taylor Swift"],
//         "rnb": ["Post Malone", "Drake"],
//         "metal": ["Black Sabbath", "Iron Maiden"]
//     };
//     for (var key in artistBasedOnGenreList)
//     {
//         if (key in this.state.genres)
//         {
//             var artistNames = artistBasedOnGenreList[Key];
//             for (artist in artistNames)
//             {
//                 var artistName = String(artist)
//                 return(
//                     <option value="artistName">{artistName}</option>
//                 )
//             }
//         }
//     }
// }
}

export default CreateEditAccountDialog;