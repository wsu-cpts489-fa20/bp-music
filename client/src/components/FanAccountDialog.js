import React, { Component, PropTypes } from 'react';

const FanAccountDialog = ({cancel, genres, artists, venues}) => {

    return(
            <div className="modal" role="dialog" id="editFanDialog">
            <div className="modal-dialog modal-lg"></div>
            <div className="modal-content form-center">
            <div className="modal-header">
            <h3><b>My Account</b></h3>
                <button className="modal-close" onClick={cancel}>&times;</button>
            </div>
            <div className="modal-body">
            <form onSubmit={cancel}>
            <br/>
            <label>
                Favorited Genres:
            </label>
                {/* <div>
                    {genres.map((favorite, index) => (
                        <div key={index} favorite={favorite} />
                    ))}
                </div> */}
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
export default FanAccountDialog;
