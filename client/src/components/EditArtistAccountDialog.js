import React from 'react';
import { async } from 'regenerator-runtime';
import ConfirmDeleteAccount from './ConfirmDeleteAccount.js';
import Checkbox from './Checkbox.js';

class EditArtistAccountDialog extends React.Component {

    constructor(props) {
        super(props);
        this.origAccountInfo = null;
    }    

    render() {
        return (  
        <div className="modal" role="dialog" id="createNewAccountDialog">
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
                    <select name="accountType" id="accountType" value={this.state.accountType} 
                        className="form-control form-textform-center" 
                        onChange={this.handleChange}>
                        <option id="fan" value="fan">Fan</option>
                        <option id="artist" value="artist">Artist</option>
                        <option id="venue" value="venue">Venue</option>
                    </select> 
                </label>
                <br/>
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
                {!this.props.create ?  
                <button className="btn btn-small btn-danger" onClick={this.confirmDeleteAccount}>
                    Delete Account...
                </button> : null}
                <br/><br/>
                <button role="submit" id="submitAccountBtn" 
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
    
}