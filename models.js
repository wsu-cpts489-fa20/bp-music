//////////////////////////////////////////////////////////////////////////
//MONGOOSE SET-UP
//The following code sets up the app to connect to a MongoDB database
//using the mongoose library.
//////////////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
require('dotenv').config();

const connectStr = process.env.MONGO_STR;
mongoose.connect(connectStr, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    () => { console.log(`Connected to ${connectStr}.`) },
    err => { console.error(`Error connecting to ${connectStr}: ${err}`) }
  );

const Schema = mongoose.Schema;

//Define schema that maps to a document in the Users collection in the appdb
//database.
const userSchema = new Schema({
  id: String, //unique identifier for user
  password: String,
  displayName: String, //Name to be displayed within app
  authStrategy: String, //strategy used to authenticate, e.g., github, local
  profilePicURL: String, //link to profile image
  securityQuestion: String,
  securityAnswer: {
    type: String, required: function () { return this.securityQuestion ? true : false }
  },
});
const User = mongoose.model("User", userSchema);

const fanSchema = new Schema({
  user: userSchema,
  artists: [String],
  venues: [String],
  genres: [String],
});
const Fan = mongoose.model("Fan", fanSchema);

const artistSchema = new Schema({
  user: userSchema,
  artistName: String,
  mediaLinks: [String]
});
const Artist = mongoose.model("Artist", artistSchema);

exports.User = User;
exports.Artist = Artist;
exports.Fan = Fan;
// exports.Venue = Venue;