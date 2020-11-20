"use strict";

var _passport = _interopRequireDefault(require("passport"));

var _passportGithub = _interopRequireDefault(require("passport-github"));

var _passportLocal = _interopRequireDefault(require("passport-local"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _regeneratorRuntime = _interopRequireDefault(require("regenerator-runtime"));

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var _venueRoutes = _interopRequireDefault(require("./routes/venue-routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

require('dotenv').config();

var LOCAL_PORT = 8081;
var DEPLOY_URL = "http://localhost:8081";
var PORT = process.env.HTTP_PORT || LOCAL_PORT;
var GithubStrategy = _passportGithub["default"].Strategy;
var LocalStrategy = _passportLocal["default"].Strategy;
var app = (0, _express["default"])(); //////////////////////////////////////////////////////////////////////////
//PASSPORT SET-UP
//The following code sets up the app with OAuth authentication using
//the 'github' strategy in passport.js.
//////////////////////////////////////////////////////////////////////////

var User = require('./models').User;

var Fan = require('./models').Fan;

var Artist = require('./models').Artist;

var Venue = require('./models').Venue;

_passport["default"].use(new GithubStrategy({
  clientID: process.env.GH_CLIENT_ID,
  clientSecret: process.env.GH_CLIENT_SECRET,
  callbackURL: DEPLOY_URL + "/auth/github/callback"
},
/*#__PURE__*/
//The following function is called after user authenticates with github
function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee(accessToken, refreshToken, profile, done) {
    var userId, currentUser;
    return _regeneratorRuntime["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("User authenticated through GitHub! In passport callback."); //Our convention is to build userId from displayName and provider

            userId = "".concat(profile.username, "@").concat(profile.provider); //See if document with this unique userId exists in database 

            _context.next = 4;
            return User.findOne({
              id: userId
            });

          case 4:
            currentUser = _context.sent;

            if (currentUser) {
              _context.next = 9;
              break;
            }

            _context.next = 8;
            return new User({
              id: userId,
              displayName: profile.displayName,
              authStrategy: profile.provider,
              profilePicURL: profile.photos[0].value,
              rounds: []
            }).save();

          case 8:
            currentUser = _context.sent;

          case 9:
            return _context.abrupt("return", done(null, currentUser));

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}()));

_passport["default"].use(new LocalStrategy({
  passReqToCallback: true
},
/*#__PURE__*/
//Called when user is attempting to log in with local username and password. 
//userId contains the email address entered into the form and password
//contains the password entered into the form.
function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee2(req, userId, password, done) {
    var thisUser, tryFansUser, tryArtistUser, tryVenueUser;
    return _regeneratorRuntime["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return User.findOne({
              id: userId
            });

          case 3:
            thisUser = _context2.sent;

            if (!thisUser) {
              _context2.next = 11;
              break;
            }

            if (!(thisUser.password === password)) {
              _context2.next = 9;
              break;
            }

            return _context2.abrupt("return", done(null, thisUser));

          case 9:
            req.authError = "The password is incorrect. Please try again" + " or reset your password.";
            return _context2.abrupt("return", done(null, false));

          case 11:
            _context2.next = 13;
            return Fan.findOne({
              'user.id': userId
            });

          case 13:
            tryFansUser = _context2.sent;

            if (!tryFansUser) {
              _context2.next = 21;
              break;
            }

            if (!(tryFansUser.user.password === password)) {
              _context2.next = 19;
              break;
            }

            return _context2.abrupt("return", done(null, tryFansUser));

          case 19:
            req.authError = "The password is incorrect. Please try again" + " or reset your password.";
            return _context2.abrupt("return", done(null, false));

          case 21:
            _context2.next = 23;
            return Artist.findOne({
              'user.id': userId
            });

          case 23:
            tryArtistUser = _context2.sent;

            if (!tryArtistUser) {
              _context2.next = 32;
              break;
            }

            console.log("Inside tryArtistUser!!");

            if (!(tryArtistUser.user.password === password)) {
              _context2.next = 30;
              break;
            }

            return _context2.abrupt("return", done(null, tryArtistUser));

          case 30:
            req.authError = "The password is incorrect. Please try again" + " or reset your password.";
            return _context2.abrupt("return", done(null, false));

          case 32:
            _context2.next = 34;
            return Venue.findOne({
              'user.id': userId
            });

          case 34:
            tryVenueUser = _context2.sent;

            if (!tryVenueUser) {
              _context2.next = 44;
              break;
            }

            if (!(tryVenueUser.user.password === password)) {
              _context2.next = 40;
              break;
            }

            return _context2.abrupt("return", done(null, tryVenueUser));

          case 40:
            req.authError = "The password is incorrect. Please try again" + " or reset your password.";
            return _context2.abrupt("return", done(null, false));

          case 42:
            _context2.next = 46;
            break;

          case 44:
            //userId not found in DB
            req.authError = "There is no account with email " + userId + ". Please try again.";
            return _context2.abrupt("return", done(null, false));

          case 46:
            _context2.next = 51;
            break;

          case 48:
            _context2.prev = 48;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", done(_context2.t0));

          case 51:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 48]]);
  }));

  return function (_x5, _x6, _x7, _x8) {
    return _ref2.apply(this, arguments);
  };
}())); //Serialize the current user to the session


_passport["default"].serializeUser(function (user, done) {
  console.log("In serializeUser.");
  console.log("Contents of user param: " + JSON.stringify(user));
  done(null, user.id);
}); //Deserialize the current user from the session
//to persistent storage.


_passport["default"].deserializeUser( /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee3(userId, done) {
    var thisUser;
    return _regeneratorRuntime["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log("In deserializeUser.");
            console.log("Contents of userId param: " + userId);
            _context3.prev = 2;
            _context3.next = 5;
            return User.findOne({
              id: userId
            });

          case 5:
            thisUser = _context3.sent;
            console.log("User with id " + userId + " found in DB. User object will be available in server routes as req.user.");
            done(null, thisUser);
            _context3.next = 13;
            break;

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](2);
            done(_context3.t0);

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 10]]);
  }));

  return function (_x9, _x10) {
    return _ref3.apply(this, arguments);
  };
}()); //////////////////////////////////////////////////////////////////////////
//INITIALIZE EXPRESS APP
// The following code uses express.static to serve the React app defined 
//in the client/ directory at PORT. It also writes an express session
//to a cookie, and initializes a passport object to support OAuth.
/////////////////////////////////////////////////////////////////////////


app.use((0, _expressSession["default"])({
  secret: "speedgolf",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60
  }
})).use(_express["default"]["static"](_path["default"].join(__dirname, "client/build"))).use(_passport["default"].initialize()).use(_passport["default"].session()).use(_express["default"].json({
  limit: '20mb'
})).listen(PORT, function () {
  return console.log("Listening on ".concat(PORT));
}); //////////////////////////////////////////////////////////////////////////
//DEFINE EXPRESS APP ROUTES
//////////////////////////////////////////////////////////////////////////

require('./routes/fan-routes')(app);

require('./routes/artist-routes')(app);

require('./routes/venue-routes')(app);

require('./routes/user-routes')(app);

require('./routes/auth-routes')(app, _passport["default"]);

require('./routes/google-map-routes')(app);
