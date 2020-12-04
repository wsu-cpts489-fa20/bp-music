import React from 'react';
import { async } from 'regenerator-runtime';
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


class EditFanAccount extends React.Component {

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
}

export default EditFanAccount