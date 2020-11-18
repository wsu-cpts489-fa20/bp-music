import React from 'react';
import ConfirmDeleteAccount from './ConfirmDeleteAccount.js';
import Checkbox from './Checkbox.js';

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
                      showFanDialog: false,
                      showArtistDialog: false,
                      showVenueDialog: false,
                      url: "",
                      genres: [],
                      artists: [],
                      venues: [],
                      genreCheckboxes: genreList.reduce(
                        (options, option) => ({
                          ...options,
                          [option]: false
                        }), {}),
                      artistCheckboxes: artistList.reduce(
                        (options, option) => ({
                          ...options,
                          [option]: false
                        }), {}),
                      venueCheckboxes: venueList.reduce(
                        (options, option) => ({
                          ...options,
                          [option]: false
                        }), {})
                    };
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
                           securityQuestion: userData.securityQuestion,
                           securityAnswer: userData.securityAnswer,
                           accountType: userData.accountType,});
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
        } else if(event.target.name === "genres" || event.target.name === "artists" || event.target.name === "venues") {
            this.setState({genres: Array.from(event.target.selectedOptions, (item) => item.value)});
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
        event.preventDefault();
        this.setState({showFanDialog: false, showArtistDialog: false, showVenueDialog: false})
        //Initialize account
        let userData;
        if (this.state.accountType == "fan") {
            let userData = {
            displayName: this.state.displayName,
            password: this.state.password,
            profilePicURL: this.state.profilePicURL,
            securityQuestion: this.state.securityQuestion,
            securityAnswer: this.state.securityAnswer,
            accountType: this.state.accountType,
            genres: this.state.genres,
            artists: this.state.artists,
            venues:this.state.venues
        };}
        if (this.state.accountType == "artist") {
            let userData = {
            displayName: this.state.displayName,
            password: this.state.password,
            profilePicURL: this.state.profilePicURL,
            securityQuestion: this.state.securityQuestion,
            securityAnswer: this.state.securityAnswer,
            accountType: this.state.accountType,
            artistName: this.state.artistName,
            genres: this.state.genres,
            instagramHandle: this.state.instagramHandle,
            facebookHandle: this.state.facebookHandle
        };}
        if (this.state.accountType == "venue") {
            let userData = {
            displayName: this.state.displayName,
            password: this.state.password,
            profilePicURL: this.state.profilePicURL,
            securityQuestion: this.state.securityQuestion,
            securityAnswer: this.state.securityAnswer,
            accountType: this.state.accountType
        };}
        const url = '/users/fans';
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
                Account Type:
                <select name="accountType" value={this.state.accountType} 
                    className="form-control form-textform-center" 
                    onChange={this.handleChange}>
                    <option value="fan">Fan</option>
                    <option value="artist">Artist</option>
                    <option value="venue">Venue</option>
                </select> 
            </label>
            <br/>
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
          <ConfirmDeleteAccount email={this.state.accountName} deleteAccount={this.deleteAccount}
                                close={() => (this.setState({confirmDelete: false}))}/> : null}
        {this.state.showFanDialog ? this.renderFanDialog() : null}
        {this.state.showArtistDialog ? this.renderArtistDialog() : null}
        {this.state.showVenueDialog ? this.renderVenueDialog() : null}
    </div>
    );
}

handleAccountType = (event) => {
    event.preventDefault();
    if (this.state.accountType == "fan") {
        this.setState({showFanDialog: true});
    }
    if (this.state.accountType == "artist") {
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
        </label>
        {genreList.map(this.createGenreCheckbox)}
            <div className="form-group mt-2">
                <button
                type="button"
                className="btn btn-outline-primary mr-2"
                onClick={this.selectAllGenre}
                > Select All </button>
                <button
                type="button"
                className="btn btn-outline-primary mr-2"
                onClick={this.deselectAllGenre}
                > Deselect All </button>
            </div>
        <br/>
        <label>
            Artists:
        </label>
        {artistList.map(this.createArtistCheckbox)}
            <div className="form-group mt-2">
                <button
                type="button"
                className="btn btn-outline-primary mr-2"
                onClick={this.selectAllArtist}
                > Select All </button>
                <button
                type="button"
                className="btn btn-outline-primary mr-2"
                onClick={this.deselectAllArtist}
                > Deselect All </button>
            </div>
        <br/>
        <label>
            Venues:
        </label>
        {venueList.map(this.createVenueCheckbox)}
            <div className="form-group mt-2">
                <button
                type="button"
                className="btn btn-outline-primary mr-2"
                onClick={this.selectAllVenue}
                > Select All </button>
                <button
                type="button"
                className="btn btn-outline-primary mr-2"
                onClick={this.deselectAllVenue}
                > Deselect All </button>
            </div>
        <br/>
        <button role="submit" className="btn btn-primary btn-color-theme modal-submit-btn">
            &nbsp;Create Fan Account</button>
        </form>
    </div></div></div>
    );
}

renderArtistDialog = () => {
    return (
        <div className="modal" role="dialog">
        <div className="modal-dialog modal-lg"></div>
        <div className="modal-content form-center">
        <div className="modal-header">
        <h3><b>Artist Account</b></h3>
            <button className="modal-close" onClick={this.props.cancel}>&times;</button>
        </div>
        <div className="modal-body">
        <form onSubmit={this.handleSubmit}>
        <br/>
        <label>
            Artist Name:
            <input
            className="form-control form-text form-center"
            name="artistName"
            type="text"
            size="30"
            placeholder="Artist Name"
            required={true}
            value={this.state.artistName}
            onChange={this.handleChange}
            />
        </label>
        <br/>
        <label>
            Genres:
            <select name="genres"
                value={this.state.genres} 
                onChange={this.handleChange} 
                className="form-control form-textform-center"
                multiple>
                <option value="pop">Pop</option>
                <option value="hip-hop">Hip-Hop</option>
                <option value="rap">Rap</option>
                <option value="rock">Rock</option>
                <option value="edm">EDM</option>
                <option value="country">Country</option>
            </select>
        </label>
        <br/>
        <label>
            Instagram:
            <input
            className="form-control form-text form-center"
            name="instagram"
            type="text"
            size="30"
            placeholder="@"
            required={true}
            value={this.state.instagram}
            onChange={this.handleChange}
            />
        </label>
        <br/>
        <label>
            Facebook:
            <input
            className="form-control form-text form-center"
            name="facebook"
            type="text"
            size="30"
            placeholder="@"
            required={true}
            value={this.state.facebook}
            onChange={this.handleChange}
            />
        </label>
        <br/>
        <button role="submit" className="btn btn-primary btn-color-theme modal-submit-btn">
            &nbsp;Create Artist Account</button>
        </form>
        </div></div></div>
    );
}

renderVenueDialog = () => {
    return (
        <div className="modal" role="dialog">
        <div className="modal-dialog modal-lg"></div>
        <div className="modal-content form-center">
        <div className="modal-header">
        <h3><b>Create Venue Account</b></h3>
            <button className="modal-close" onClick={this.props.cancel}>&times;</button>
        </div>
        <div className="modal-body">
        <form onSubmit={this.handleSubmit}>

        <button role="submit" className="btn btn-primary btn-color-theme modal-submit-btn">
            &nbsp;Create Venue Account</button>
        </form>
        </div></div></div>
    );
}

//////////////////////////////////////////////////////////////////////////////////////////////
// Create Account Page checkboxes
//////////////////////////////////////////////////////////////////////////////////////////////
// Functions for select all checkboxes for genre/artist/venue
selectAllGenreCheckboxes = isSelected => {
    Object.keys(this.state.genreCheckboxes).forEach(checkbox => {
      // BONUS: Can you explain why we pass updater function to setState instead of an object?
      this.setState(prevState => ({
        genreCheckboxes: {
          ...prevState.genreCheckboxes,
          [checkbox]: isSelected
        }
      }));
    });
  };
  selectAllArtistCheckboxes = isSelected => {
    Object.keys(this.state.artistCheckboxes).forEach(checkbox => {
      this.setState(prevState => ({
        artistCheckboxes: {
          ...prevState.artistCheckboxes,
          [checkbox]: isSelected
        }
      }));
    });
  };
  selectAllVenueCheckboxes = isSelected => {
    Object.keys(this.state.venueCheckboxes).forEach(checkbox => {
      // BONUS: Can you explain why we pass updater function to setState instead of an object?
      this.setState(prevState => ({
        venueCheckboxes: {
          ...prevState.venueCheckboxes,
          [checkbox]: isSelected
        }
      }));
    });
  };

  // Function to update state for select/deselect all checkboxes genre/artist/venue
  selectAllGenre = () => this.selectAllGenreCheckboxes(true);

  deselectAllGenre = () => this.selectAllGenreCheckboxes(false);

  selectAllArtist = () => this.selectAllArtistCheckboxes(true);

  deselectAllArtist = () => this.selectAllArtistCheckboxes(false);

  selectAllVenue = () => this.selectAllVenueCheckboxes(true);

  deselectAllVenue = () => this.selectAllVenueCheckboxes(false);

  // Functions to handle checkboxe changes genre/artist/venue
  handleGenreCheckboxChange = changeEvent => {
    const { name } = changeEvent.target;

    this.setState(prevState => ({
      genreCheckboxes: {
        ...prevState.genreCheckboxes,
        [name]: !prevState.genreCheckboxes[name]
      }
    }));
  };

  handleArtistCheckboxChange = changeEvent => {
    const { name } = changeEvent.target;

    this.setState(prevState => ({
      artistCheckboxes: {
        ...prevState.artistCheckboxes,
        [name]: !prevState.artistCheckboxes[name]
      }
    }));
  };

  handleVenueCheckboxChange = changeEvent => {
    const { name } = changeEvent.target;

    this.setState(prevState => ({
      venueCheckboxes: {
        ...prevState.venueCheckboxes,
        [name]: !prevState.venueCheckboxes[name]
      }
    }));
  };

  // Functions for creating a single checkboxe for genre/artist/venue
  createGenreCheckbox = option => (
    <Checkbox
      label={option}
      isSelected={this.state.genreCheckboxes[option]}
      onCheckboxChange={this.handleGenreCheckboxChange}
      key={option}
    />
  );
  createArtistCheckbox = option => (
    <Checkbox
      label={option}
      isSelected={this.state.artistCheckboxes[option]}
      onCheckboxChange={this.handleArtistCheckboxChange}
      key={option}
    />
  );

  createVenueCheckbox = option => (
    <Checkbox
      label={option}
      isSelected={this.state.venueCheckboxes[option]}
      onCheckboxChange={this.handleVenueCheckboxChange}
      key={option}
    />
  );

//////////////////////////////////////////////////////////////////////////////////////////////
//handleFanSubmit -- Triggered when user clicks on submit button to
    //either create or edit a fan account.
    //Custom data checking ensures user account under this email does not 
    //already exist and that the rest of the info is valid. We create a new  
    // object for a fan user, save it to localStorage and take user to app's 
    //landing page. 
//   handleFanSubmit = async(event) => {
//       event.preventDefault();
//       this.setState({showFanDialog: false})
//       // Initialize checkboxes for create account pages
//        Object.keys(this.state.genreCheckboxes)
//        .filter(checkbox => this.state.genreCheckboxes[checkbox])
//        .forEach(checkbox => {
//            console.log(checkbox, "is selected.");
//            this.state.genres.push(checkbox);
//         });
//        Object.keys(this.state.artistCheckboxes)
//        .filter(checkbox => this.state.artistCheckboxes[checkbox])
//        .forEach(checkbox => {
//            console.log(checkbox, "is selected.");
//            this.state.artists.push(checkbox);
//         });
//        Object.keys(this.state.venueCheckboxes)
//        .filter(checkbox => this.state.venueCheckboxes[checkbox])
//        .forEach(checkbox => {
//            console.log(checkbox, "is selected.");
//            this.state.venues.push(checkbox);
//         });

//         //Initialize user account
//        let userData = {
//            password: this.state.password,
//            displayName: this.state.displayName,
//            profilePicURL: this.state.profilePicURL,
//            securityQuestion: this.state.securityQuestion,
//            securityAnswer: this.state.securityAnswer,
//            artists: this.state.artists,
//            venues: this.state.venues,
//            genres: this.state.genres
//         };
//        const url = '/fans/' + this.state.accountName;
//        let res;
//        if (this.props.create) { //use POST route to create new user account
//         res = await fetch(url, {
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//             method: 'POST',
//             body: JSON.stringify(userData)}); 
//             if (res.status == 200) { //successful account creation!
//                 this.props.done("New fan account created! Enter credentials to log in.",false);
//             } else { //Unsuccessful account creation
//                 //Grab textual error message
//                 const resText = await res.text();
//                 this.props.done(resText,false);
//             }
//         } else { //use PUT route to update existing user account
//             res = await fetch(url, {
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json'
//                     },
//                 method: 'PUT',
//                 body: JSON.stringify(userData)}); 
//             if (res.status == 200) { //successful account creation!
//                 this.props.done("Fan Account Updated!",false);
//             } else { //Unsuccessful account update
//                 //Grab textual error message
//                 const resText = await res.text();
//                 this.props.done(resText,false);
//             }
//         }
//     }
}
export default CreateEditAccountDialog;