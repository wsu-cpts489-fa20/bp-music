import React from 'react';

class AboutBox extends React.Component {

render() {
    return (
        <div className="modal" role="dialog">
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
            <div className="modal-header">
                <h3>About URScene</h3>
                <button className="modal-close" onClick={this.props.close}>
                    &times;
                </button>
            </div>
            <div className="modal-body">
                <img
                src="https://drive.google.com/thumbnail?id=1eZNPpR_z5XeD0EgHckjFhyPXxTNrkT0Y"
                height="200" width="300"/>
                <h3>Discover the Music Near You</h3>
                <p>A WSU CptS 489 Fall 2020 Student Project<br/>
                &copy; Developers: Christian Hunter, Tristan Neal, Kaitlin Radford, and Madison Holcomb
                </p>
                <div style={{textAlign: "left"}}>
                <p>The apps current implementations include:</p>
                <ul>
                <li> Creating a Fan or Venue Account </li>
                <li> Tracking Created Events</li>
                <li> Google API location search</li>
                </ul>
                <p>This app is a minimum viable product, other potential features include:</p>
                <ul>
                <li> Creating an Artist Account</li>
                <li> Updating the users preferences from Account Creation</li>
                <li> More personalized design</li>
                </ul>
                <p> Skeletal code for this project was provided by our instructor Christopher Hundhausen, software documentation was done by Tristan Neal and Christian Hunter</p>
                </div>
            </div>
            <div className="modal-footer">
                <button className="btn btn-primary btn-color-theme"
                onClick={this.props.close}>OK</button>
                </div>
            </div>
        </div>
        </div>
    );
    }
}

export default AboutBox;