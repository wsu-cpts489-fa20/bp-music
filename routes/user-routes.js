/////////////////////////////////
//USER ACCOUNT MANAGEMENT ROUTES
////////////////////////////////

const User = require('../models').User;

module.exports = function (app) {
    //READ user route: Retrieves the user with the specified userId from users collection (GET)
    app.get('/users/:userId', async (req, res, next) => {
        console.log("in /users route (GET) with userId = " +
            JSON.stringify(req.params.userId));
        try {
            let thisUser = await User.findOne({ id: req.params.userId });
            if (!thisUser) {
                return res.status(404).send("No user account with id " +
                    req.params.userId + " was found in database.");
            } else {
                return res.status(200).json(JSON.stringify(thisUser));
            }
        } catch (err) {
            console.log()
            return res.status(400).send("Unexpected error occurred when looking up user with id " +
                req.params.userId + " in database: " + err);
        }
    });

    //CREATE user route: Adds a new user account to the users collection (POST)
    app.post('/users/:userId', async (req, res, next) => {
        console.log("in /users route (POST) with params = " + JSON.stringify(req.params) +
            " and body = " + JSON.stringify(req.body));
        if (req.body === undefined ||
            !req.body.hasOwnProperty("password") ||
            !req.body.hasOwnProperty("displayName") ||
            !req.body.hasOwnProperty("profilePicURL") ||
            !req.body.hasOwnProperty("securityQuestion") ||
            !req.body.hasOwnProperty("securityAnswer")) {
            //Body does not contain correct properties
            return res.status(400).send("/users POST request formulated incorrectly. " +
                "It must contain 'password','displayName','profilePicURL','securityQuestion', and 'securityAnswer' fields in message body.")
        }
        try {
            let thisUser = await User.findOne({ id: req.params.userId });
            if (thisUser) { //account already exists
                res.status(400).send("There is already an account with email '" +
                    req.params.userId + "'.");
            } else { //account available -- add to database
                thisUser = await new User({
                    id: req.params.userId,
                    password: req.body.password,
                    displayName: req.body.displayName,
                    authStrategy: 'local',
                    profilePicURL: req.body.profilePicURL,
                    securityQuestion: req.body.securityQuestion,
                    securityAnswer: req.body.securityAnswer,
                    rounds: []
                }).save();
                return res.status(201).send("New account for '" +
                    req.params.userId + "' successfully created.");
            }
        } catch (err) {
            return res.status(400).send("Unexpected error occurred when adding or looking up user in database. " + err);
        }
    });

    //UPDATE user route: Updates a new user account in the users collection (POST)
    app.put('/users/:userId', async (req, res, next) => {
        console.log("in /users update route (PUT) with userId = " + JSON.stringify(req.params) +
            " and body = " + JSON.stringify(req.body));
        if (!req.params.hasOwnProperty("userId")) {
            return res.status(400).send("users/ PUT request formulated incorrectly." +
                "It must contain 'userId' as parameter.");
        }
        const validProps = ['password', 'displayName', 'profilePicURL',
            'securityQuestion', 'securityAnswer'];
        for (const bodyProp in req.body) {
            if (!validProps.includes(bodyProp)) {
                return res.status(400).send("users/ PUT request formulated incorrectly." +
                    "Only the following props are allowed in body: " +
                    "'password', 'displayname', 'profilePicURL', 'securityQuestion', 'securityAnswer'");
            }
        }
        try {
            let status = await User.updateOne({ id: req.params.userId },
                { $set: req.body });
            if (status.nModified != 1) { //account could not be found
                res.status(404).send("No user account " + req.params.userId + " exists. Account could not be updated.");
            } else {
                res.status(200).send("User account " + req.params.userId + " successfully updated.")
            }
        } catch (err) {
            res.status(400).send("Unexpected error occurred when updating user data in database: " + err);
        }
    });

    //DELETE user route: Deletes the document with the specified userId from users collection (DELETE)
    app.delete('/users/:userId', async (req, res, next) => {
        console.log("in /users route (DELETE) with userId = " +
            JSON.stringify(req.params.userId));
        try {
            let status = await User.deleteOne({ id: req.params.userId });
            if (status.deletedCount != 1) {
                return res.status(404).send("No user account " +
                    req.params.userId + " was found. Account could not be deleted.");
            } else {
                return res.status(200).send("User account " +
                    req.params.userId + " was successfully deleted.");
            }
        } catch (err) {
            console.log()
            return res.status(400).send("Unexpected error occurred when attempting to delete user account with id " +
                req.params.userId + ": " + err);
        }
    });
}