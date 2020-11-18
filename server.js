//////////////////////////////////////////////////////////////////////////
//IMPORTS AND VARIABLE INITIALIZATIONS
//The following code imports necessary dependencies and initializes
//variables used in the server middleware.
//////////////////////////////////////////////////////////////////////////
import passport from 'passport';
import passportGithub from 'passport-github';
import passportLocal from 'passport-local';
import session from 'express-session';
import regeneratorRuntime from "regenerator-runtime";
import path from 'path';
import express from 'express';

require('dotenv').config();

const LOCAL_PORT = 8081;
const DEPLOY_URL = "http://localhost:8081";
const PORT = process.env.HTTP_PORT || LOCAL_PORT;
const GithubStrategy = passportGithub.Strategy;
const LocalStrategy = passportLocal.Strategy;
const app = express();

//////////////////////////////////////////////////////////////////////////
//PASSPORT SET-UP
//The following code sets up the app with OAuth authentication using
//the 'github' strategy in passport.js.
//////////////////////////////////////////////////////////////////////////
const User = require('./models').User;
passport.use(new GithubStrategy({
  clientID: process.env.GH_CLIENT_ID,
  clientSecret: process.env.GH_CLIENT_SECRET,
  callbackURL: DEPLOY_URL + "/auth/github/callback"
},
  //The following function is called after user authenticates with github
  async (accessToken, refreshToken, profile, done) => {
    console.log("User authenticated through GitHub! In passport callback.");
    //Our convention is to build userId from displayName and provider
    const userId = `${profile.username}@${profile.provider}`;
    //See if document with this unique userId exists in database 
    let currentUser = await User.findOne({ id: userId });
    if (!currentUser) { //Add this user to the database
      currentUser = await new User({
        id: userId,
        displayName: profile.displayName,
        authStrategy: profile.provider,
        profilePicURL: profile.photos[0].value,
        rounds: []
      }).save();
    }
    return done(null, currentUser);
  }));

passport.use(new LocalStrategy({ passReqToCallback: true },
  //Called when user is attempting to log in with local username and password. 
  //userId contains the email address entered into the form and password
  //contains the password entered into the form.
  async (req, userId, password, done) => {
    let thisUser;
    try {
      thisUser = await User.findOne({ id: userId });
      if (thisUser) {
        if (thisUser.password === password) {
          return done(null, thisUser);
        } else {
          req.authError = "The password is incorrect. Please try again" +
            " or reset your password.";
          return done(null, false)
        }
      } else { //userId not found in DB
        req.authError = "There is no account with email " + userId +
          ". Please try again.";
        return done(null, false);
      }
    } catch (err) {
      return done(err);
    }
  }
));

//Serialize the current user to the session
passport.serializeUser((user, done) => {
  console.log("In serializeUser.");
  console.log("Contents of user param: " + JSON.stringify(user));
  done(null, user.id);
});

//Deserialize the current user from the session
//to persistent storage.
passport.deserializeUser(async (userId, done) => {
  console.log("In deserializeUser.");
  console.log("Contents of userId param: " + userId);
  let thisUser;
  try {
    thisUser = await User.findOne({ id: userId });
    console.log("User with id " + userId +
      " found in DB. User object will be available in server routes as req.user.")
    done(null, thisUser);
  } catch (err) {
    done(err);
  }
});

//////////////////////////////////////////////////////////////////////////
//INITIALIZE EXPRESS APP
// The following code uses express.static to serve the React app defined 
//in the client/ directory at PORT. It also writes an express session
//to a cookie, and initializes a passport object to support OAuth.
/////////////////////////////////////////////////////////////////////////
app
  .use(session({
    secret: "speedgolf",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 }
  }))
  .use(express.static(path.join(__dirname, "client/build")))
  .use(passport.initialize())
  .use(passport.session())
  .use(express.json({ limit: '20mb' }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

//////////////////////////////////////////////////////////////////////////
//DEFINE EXPRESS APP ROUTES
//////////////////////////////////////////////////////////////////////////

require('./routes/fan-routes')(app);
require('./routes/artist-routes')(app);
require('./routes/venue-routes')(app)
require('./routes/user-routes')(app);
require('./routes/auth-routes')(app, passport);
require('./routes/google-map-routes')(app);
