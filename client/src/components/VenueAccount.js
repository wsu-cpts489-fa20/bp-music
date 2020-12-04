import React from 'react';

class VenueAccount extends React.Component {
    constructor(props) {
        super(props);
        this.origAccountInfo = null;
        //Create a ref for the email input DOM element
        this.state = {
                    };
    }

    handleChange = (event) => {
        
    }

    render () { 
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