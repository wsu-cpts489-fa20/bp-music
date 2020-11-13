class CreateEditAccountDialog extends React.Component {

    render() {
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
                        <select name="genres[]" id="genres" onChange={this.props.handleGenres} multiple>
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
                        <select name="artists[]" id="artists" onChange={this.props.handleArtists} multiple>
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
                        <select name="avenues[]" id="venues" onChange={this.props.handleVenues} multiple>
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
}