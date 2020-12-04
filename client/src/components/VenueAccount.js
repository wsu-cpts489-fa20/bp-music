import React from 'react';

class VenueAccount extends React.Component {
    constructor(props) {
        super(props);
        this.origAccountInfo = null;
        //Create a ref for the email input DOM element
        this.state = {
            displayName = 'No Name!'
                    };
    }

    handleChange = (event) => {
        
    }

    render(){
        return(
            
        <div className="modal-body">
            <h3><b>Your Venue Account</b></h3>
            <div className="sidemenu-title">
            <img src={this.props.profilePicURL} height='60' width='60' />
            <span id="userID" className="sidemenu-userID">&nbsp;{this.props.displayName}</span>
             </div>
            
        </div>
        );
    }

    renderVenue = () => {
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
            <label>
                Email: 
                <input
                id="emailInput"  
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
                id="passwordInput"
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
                id="repeatPasswordInput"
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
                id="displayNameInput"
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
                id="profilePic"
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
                id="securityQInput"
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
                id="securityAInput"
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
            Street Address:
                    <input
                    className="form-control form-text form-center"
                    name="venue_location"
                    type="text"
                    size="40"
                    placeholder="123 Example St. Portland, OR"
                    required={true}
                    value={this.state.venue_location}
                    onChange={this.handleChange}
                    />
            Email:
                    <input
                    className="form-control form-text form-center"
                    name="Email"
                    type="text"
                    size="30"
                    placeholder="Email"
                    required={true}
                    value={this.state.email}
                    onChange={this.handleChange}
                    />
            Phone:
            <input
                    className="form-control form-text form-center"
                    name="Phone"
                    type="text"
                    size="30"
                    placeholder="666-777-1337"
                    required={true}
                    value={this.state.phone_number}
                    onChange={this.handleChange}
                    />
            Social Media Links:
            <input
                    className="form-control form-text form-center"
                    name="social_media"
                    type="text"
                    size="30"
                    placeholder="Facebook,IG,Etc."
                    required={true}
                    value={this.state.social_media}
                    onChange={this.handleChange}
                    />
            <p></p>
            
            <button role="submit" className="btn btn-primary btn-color-theme modal-submit-btn">
                &nbsp;Create Venue Account</button>
            </form>
            </div></div></div>

        );
    }

    renderVenueDialog = () =>  { 
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
            <label>
                Email: 
                <input
                id="emailInput"  
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
                id="passwordInput"
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
                id="repeatPasswordInput"
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
                id="displayNameInput"
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
                id="profilePic"
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
                id="securityQInput"
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
                id="securityAInput"
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
            Street Address:
                    <input
                    className="form-control form-text form-center"
                    name="venue_location"
                    type="text"
                    size="40"
                    placeholder="123 Example St. Portland, OR"
                    required={true}
                    value={this.state.venue_location}
                    onChange={this.handleChange}
                    />
            Email:
                    <input
                    className="form-control form-text form-center"
                    name="Email"
                    type="text"
                    size="30"
                    placeholder="Email"
                    required={true}
                    value={this.state.email}
                    onChange={this.handleChange}
                    />
            Phone:
            <input
                    className="form-control form-text form-center"
                    name="Phone"
                    type="text"
                    size="30"
                    placeholder="666-777-1337"
                    required={true}
                    value={this.state.phone_number}
                    onChange={this.handleChange}
                    />
            Social Media Links:
            <input
                    className="form-control form-text form-center"
                    name="social_media"
                    type="text"
                    size="30"
                    placeholder="Facebook,IG,Etc."
                    required={true}
                    value={this.state.social_media}
                    onChange={this.handleChange}
                    />
            <p></p>
            
            <button role="submit" className="btn btn-primary btn-color-theme modal-submit-btn">
                &nbsp;Create Venue Account</button>
            </form>
            </div></div></div>
        );
    }

}
export default VenueAccount;