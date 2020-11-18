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

    //Body does not contain correct properties
    if (req.body === undefined) {
      return res.status(400).send("/artists POST request formulated incorrectly. " +
        "Message body is undefined.")
    }
    if (!req.body.hasOwnProperty("password")) {
      return res.status(400).send("/artists POST request formulated incorrectly. " +
        "It must contain 'password' field in message body.")
    }
    if (!req.body.hasOwnProperty("displayName")) {
      return res.status(400).send("/artists POST request formulated incorrectly. " +
        "It must contain 'displayName' field in message body.")
    }
    if (!req.body.hasOwnProperty("profilePicURL")) {
      return res.status(400).send("/artists POST request formulated incorrectly. " +
        "It must contain 'profilePicURL' field in message body.")
    }
    if (!req.body.hasOwnProperty("securityQuestion")) {
      return res.status(400).send("/artists POST request formulated incorrectly. " +
        "It must contain 'securityQuestion' field in message body.")
    }
    if (!req.body.hasOwnProperty("securityAnswer")) {
      return res.status(400).send("/artists POST request formulated incorrectly. " +
        "It must contain 'securityAnswer' field in message body.")
    }
    if (!req.body.hasOwnProperty("genres")) {
      return res.status(400).send("/artists POST request formulated incorrectly. " +
        "It must contain 'genres' field in message body.")
    }
    if (!req.body.hasOwnProperty("facebookHandle")) {
      return res.status(400).send("/artists POST request formulated incorrectly. " +
        "It must contain 'facebookHandle' field in message body.")
    }
    if (!req.body.hasOwnProperty("instagramHandle")) {
      return res.status(400).send("/artists POST request formulated incorrectly. " +
        "It must contain 'instagramHandle' field in message body.")
    } 
    if (!req.body.hasOwnProperty("artistName")) {
      return res.status(400).send("/artists POST request formulated incorrectly. " +
        "It must contain 'artistName' field in message body.")
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
        facebookHandle: req.body.facebookHandle,
        instagramHandle: req.body.instagramHandle,
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
      'securityQuestion', 'securityAnswer', 'genres', 'facebookHandle', 'instagramHandle', 'artistName', 'user'];
    for (const bodyProp in req.body) {
      if (!validProps.includes(bodyProp)) {
        return res.status(400).send("artist/ PUT request formulated incorrectly." +
          "Only the following props are allowed in body: " +
          "'password', 'displayname', 'profilePicURL', 'securityQuestion', 'securityAnswer', 'genres', 'facebookHandle', 'instagramHandle', 'artistName', and 'user'");
      }
    }
    try {
      let artist = await Artist.findOne({ 'user.id': req.params.userId })
      if (artist) {
        for (const [key, value] of Object.entries(req.body)) {
          // Prevent user model from being completely over written and removing wanted properties
          if (key !== 'user') {
            artist[key] = value;
          }
        }
        if (req.body.hasOwnProperty('user')) {
          for (const [key, value] of Object.entries(req.body.user)) {
            artist.user[key] = value;
          }
        }

        await artist.save();
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
      let status = await Artist.deleteOne({ 'user.id': req.params.userId });
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