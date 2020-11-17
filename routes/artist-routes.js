/////////////////////////////////
//ARTIST ACCOUNT MANAGEMENT ROUTES
////////////////////////////////

const User = require('../models').User;
const Artist = require('../models').Artist;

module.exports = function (app) {

  app.get('/artists/:userId', async (req, res, next) => {
    console.log("in /artists route (GET) with userId = " +
      JSON.stringify(req.params.userId));
    try {
      let thisArtist = await Artist.findOne({ 'user.id': req.params.userId });
      if (!thisArtist) {
        return res.status(404).send("No artist account with id " +
          req.params.userId + " was found in database.");
      } else {
        return res.status(200).json(JSON.stringify(thisArtist));
      }
    } catch (err) {
      return res.status(400).send("Unexpected error occurred when looking up artist with id " +
        req.params.userId + " in database: " + err);
    }
  });

  app.post('/artists/:userId', async (req, res, next) => {
    console.log("in /artists route (POST) with params = " + JSON.stringify(req.params) +
      " and body = " + JSON.stringify(req.body));

    if (req.body === undefined ||
      !req.body.hasOwnProperty("password") ||
      !req.body.hasOwnProperty("displayName") ||
      !req.body.hasOwnProperty("profilePicURL") ||
      !req.body.hasOwnProperty("securityQuestion") ||
      !req.body.hasOwnProperty("securityAnswer") ||
      !req.body.hasOwnProperty("genres") ||
      !req.body.hasOwnProperty("facebookLink") ||
      !req.body.hasOwnProperty("instagramLink") || 
      !req.body.hasOwnProperty("artistName")) {
      //Body does not contain correct properties
      return res.status(400).send("/artists POST request formulated incorrectly. " +
        "It must contain 'password','displayName','profilePicURL','securityQuestion', 'securityAnswer', genres, facebookLink, instagramLink, and artistName fields in message body.")
    }

    try {
      let thisArtist = await Artist.findOne({ 'user.id': req.params.userId });
      if (thisArtist) { //account already exists
        return res.status(400).send("There is already an artist account with id '" +
          req.params.userId + "'.");
      }
      let thisUser = new User({
        id: req.params.userId,
        password: req.body.password,
        displayName: req.body.displayName,
        authStrategy: 'local',
        profilePicURL: req.body.profilePicURL,
        securityQuestion: req.body.securityQuestion,
        securityAnswer: req.body.securityAnswer
      });

      await new Artist({
        user: thisUser,
        genres: req.body.genres,
        facebookLink: req.body.facebookLink,
        instagramLink: req.body.instagramLink,
        artistName: req.body.artistName
      }).save();
      return res.status(201).send('New artist account created')
    } catch (err) {
      return res.status(400).send("Unexpected error occurred when adding or looking up artist in database. " + err);
    }
  });

  app.put('/artists/:userId', async (req, res, next) => {
    console.log("in /artists update route (PUT) with userId = " + JSON.stringify(req.params.userId) +
      " and body = " + JSON.stringify(req.body));
    if (!req.params.hasOwnProperty("userId")) {
      return res.status(400).send("artists/ PUT request formulated incorrectly." +
        "It must contain 'userId' as parameter.");
    }
    const validProps = ['password', 'displayName', 'profilePicURL',
      'securityQuestion', 'securityAnswer', 'venues', 'artists', 'genres', 'user'];
    for (const bodyProp in req.body) {
      if (!validProps.includes(bodyProp)) {
        return res.status(400).send("artist/ PUT request formulated incorrectly." +
          "Only the following props are allowed in body: " +
          "'password', 'displayname', 'profilePicURL', 'securityQuestion', 'securityAnswer', 'venues', 'artists', 'genres', and 'user'");
      }
    }
    try {
      let fan = await Fan.findOne({ 'user.id': req.params.userId })
      if (fan) {
        for (const [key, value] of Object.entries(req.body)) {
          if (key !== 'user') {
            fan[key] = value;
          }
        }
        if (req.body.hasOwnProperty('user')) {
          for (const [key, value] of Object.entries(req.body.user)) {
            fan.user[key] = value;
          }
        }

        await fan.save();
        return res.status(200).send("artist account " + req.params.userId + " successfully updated.")
      } else {
        return res.status(404).send('artist account ' + req.params.userId + ' not found')
      }
    } catch (err) {
      res.status(400).send("Unexpected error occurred when updating artist data in database: " + err);
    }
  });

  app.delete('/artists/:userId', async (req, res, next) => {
    console.log("in /artists route (DELETE) with userId = " +
      JSON.stringify(req.params.userId));
    try {
      let status = await Fan.deleteOne({ 'user.id': req.params.userId });
      if (status.deletedCount !== 1) {
        return res.status(404).send("No artist account " +
          req.params.userId + " was found. Account could not be deleted.");
      } else {
        return res.status(200).send("Artist account " +
          req.params.userId + " was successfully deleted.");
      }
    } catch (err) {
      return res.status(400).send("Unexpected error occurred when attempting to delete artist account with id " +
        req.params.userId + ": " + err);
    }
  });
}