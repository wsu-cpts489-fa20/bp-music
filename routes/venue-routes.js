/////////////////////////////////
//VENUE ACCOUNT MANAGEMENT ROUTES
////////////////////////////////
var LatLng = require('spherical-geometry-js').LatLng;
var computeDistanceBetween = require('spherical-geometry-js').computeDistanceBetween;
const User = require('../models').User;
const Venue = require('../models').Venue;

module.exports = function (app) {

  app.post('/venues/nearme/:distance', async (req, res, next) => {
    console.log('In /venue/nearme route with distance = ' + req.params.distance +
      ' and body = ' + req.body);
    if (req.body === undefined ||
      !req.body.hasOwnProperty('lat') ||
      !req.body.hasOwnProperty('long')) {
      return res.status(400).send('venues/nearme request formulated incorrectly. It must contain lat and long in body.')
    }
    try {
      // get all venues in the collection
      let venues = await Venue.find({});
      let nearVenues = [];
      for (let venue of venues) {
        let from = new LatLng(venue.lat, venue.long)
        let to = new LatLng(req.body.lat, req.body.long);
        let newDistance = computeDistanceBetween(from, to);
        if ((newDistance * 0.000621371) <= req.params.distance) {
          nearVenues.push(venue);
        }
      }
      if (nearVenues.length > 0) {
        return res.status(200).send(nearVenues);
      } else {
        return res.status(404).send('No veneues found within the given search distance = ' + req.params.distance);
      }
    } catch (err) {
      return res.status(400).send('An unexpected error occured while retrieving venues ' + err);
    }
  })

  app.get('/venues/:userId', async (req, res, next) => {
    console.log("in /venues route (GET) with userId = " +
      JSON.stringify(req.params.userId));
    try {
      let thisVenue = await Venue.findOne({ 'user.id': req.params.userId });
      if (!thisVenue) {
        return res.status(404).send("No venue account with id " +
          req.params.userId + " was found in database.");
      } else {
        return res.status(200).json(JSON.stringify(thisVenue));
      }
    } catch (err) {
      return res.status(400).send("Unexpected error occurred when looking up venue with id " +
        req.params.userId + " in database: " + err);
    }
  });

  app.post('/venues/:userId', async (req, res, next) => {
    console.log("in /venues route (POST) with params = " + JSON.stringify(req.params) +
      " and body = " + JSON.stringify(req.body));

    if (req.body === undefined ||
      !req.body.hasOwnProperty("password") ||
      !req.body.hasOwnProperty("displayName") ||
      !req.body.hasOwnProperty("profilePicURL") ||
      !req.body.hasOwnProperty("securityQuestion") ||
      !req.body.hasOwnProperty("securityAnswer") ||
      !req.body.hasOwnProperty("streetAddress") ||
      !req.body.hasOwnProperty("email") ||
      !req.body.hasOwnProperty("phoneNumber") ||
      !req.body.hasOwnProperty("socialMediaLinks") ||
      !req.body.hasOwnProperty("lat") ||
      !req.body.hasOwnProperty("long")) {
      !req.body.hasOwnProperty("accountType")
      ){
      //Body does not contain correct properties
      return res.status(400).send("/venues POST request formulated incorrectly. " +
        "It must contain 'password','displayName','profilePicURL','securityQuestion', 'securityAnswer', streetAddress, lat, long, email, phoneNumber, and socialMediaLinks fields in message body.")
    }

    try {
      let thisVenue = await Venue.findOne({ 'user.id': req.params.userId });
      if (thisVenue) { //account already exists
        return res.status(400).send("There is already a venue account with id '" +
          req.params.userId + "'.");
      }
      let thisUser = new User({
        id: req.params.userId,
        password: req.body.password,
        displayName: req.body.displayName,
        authStrategy: 'local',
        profilePicURL: req.body.profilePicURL,
        securityQuestion: req.body.securityQuestion,
        securityAnswer: req.body.securityAnswer,
        accountType: req.body.accountType
      });

      await new Venue({
        user: thisUser,
        streetAddress: req.body.streetAddress,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        socialMediaLinks: req.body.socialMediaLinks,
        lat: req.body.lat,
        long: req.body.long
      }).save();
      return res.status(201).send('New venue account created')
    } catch (err) {
      return res.status(400).send("Unexpected error occurred when adding or looking up venue in database. " + err);
    }
  });

  app.put('/venues/:userId', async (req, res, next) => {
    console.log("in /venues update route (PUT) with userId = " + JSON.stringify(req.params.userId) +
      " and body = " + JSON.stringify(req.body));
    if (!req.params.hasOwnProperty("userId")) {
      return res.status(400).send("venues/ PUT request formulated incorrectly." +
        "It must contain 'userId' as parameter.");
    }
    const validProps = ['password', 'displayName', 'profilePicURL',
      'securityQuestion', 'securityAnswer', 'email', 'phoneNumber', 'streetAddress', 'socialMediaLinks', 'user', 'lat', 'long'];
    for (const bodyProp in req.body) {
      if (!validProps.includes(bodyProp)) {
        return res.status(400).send("venue/ PUT request formulated incorrectly." +
          "Only the following props are allowed in body: " +
          "'password', 'displayname', 'profilePicURL', 'securityQuestion', 'securityAnswer', 'streetAddress', long, lat, 'email', 'phoneNumber', 'socialMediaLinks' and 'user'");
      }
    }
    try {
      let venue = await Venue.findOne({ 'user.id': req.params.userId })
      if (venue) {
        for (const [key, value] of Object.entries(req.body)) {
          // Prevent user model from being completely over written and removing wanted properties
          if (key !== 'user') {
            venue[key] = value;
          }
        }
        if (req.body.hasOwnProperty('user')) {
          for (const [key, value] of Object.entries(req.body.user)) {
            venue.user[key] = value;
          }
        }

        await venue.save();
        return res.status(200).send("venue account " + req.params.userId + " successfully updated.")
      } else {
        return res.status(404).send('venue account ' + req.params.userId + ' not found')
      }
    } catch (err) {
      res.status(400).send("Unexpected error occurred when updating venue data in database: " + err);
    }
  });

  app.delete('/venues/:userId', async (req, res, next) => {
    console.log("in /venues route (DELETE) with userId = " +
      JSON.stringify(req.params.userId));
    try {
      let status = await Venue.deleteOne({ 'user.id': req.params.userId });
      if (status.deletedCount !== 1) {
        return res.status(404).send("No venue account " +
          req.params.userId + " was found. Account could not be deleted.");
      } else {
        return res.status(200).send("Venue account " +
          req.params.userId + " was successfully deleted.");
      }
    } catch (err) {
      return res.status(400).send("Unexpected error occurred when attempting to delete venue account with id " +
        req.params.userId + ": " + err);
    }
  });
}