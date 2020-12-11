/////////////////////////////////
//FAN ACCOUNT MANAGEMENT ROUTES
////////////////////////////////
const Fan = require('../models').Fan;
const User = require('../models').User;

module.exports = function (app) {

    app.get('/fans/:userId', async (req, res, next) => {
        console.log("in /fans route (GET) with userId = " +
            JSON.stringify(req.params.userId));
        try {
            let thisFan = await Fan.findOne({ 'user.id': req.params.userId });
            if (!thisFan) {
                return res.status(404).send("No fan account with id " +
                    req.params.userId + " was found in database.");
            } else {
                return res.status(200).json(JSON.stringify(thisFan));
            }
        } catch (err) {
            return res.status(400).send("Unexpected error occurred when looking up fan with id " +
                req.params.userId + " in database: " + err);
        }
    });

    app.post('/fans/:userId', async (req, res, next) => {
        console.log("in /fans route (POST) with params = " + JSON.stringify(req.params) +
            " and body = " + JSON.stringify(req.body));

        if (req.body === undefined ||
            !req.body.hasOwnProperty("password") ||
            !req.body.hasOwnProperty("displayName") ||
            !req.body.hasOwnProperty("profilePicURL") ||
            !req.body.hasOwnProperty("securityQuestion") ||
            !req.body.hasOwnProperty("securityAnswer") ||
            !req.body.hasOwnProperty("artists") ||
            !req.body.hasOwnProperty("venues") ||
            !req.body.hasOwnProperty("genres")) {
            //Body does not contain correct properties
            return res.status(400).send("/fans POST request formulated incorrectly. " +
                "It must contain 'password','displayName','profilePicURL','securityQuestion', 'securityAnswer', artists, venues, and genres fields in message body.")
        }

        try {
            let thisFan = await Fan.findOne({ 'user.id': req.params.userId });
            if (thisFan) { //account already exists
                return res.status(400).send("There is already an account with email '" +
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

            await new Fan({
                user: thisUser,
                artists: req.body.artists,
                venues: req.body.venues,
                genres: req.body.genres
            }).save();
            return res.status(201).send('New fan account created')
        } catch (err) {
            return res.status(400).send("Unexpected error occurred when adding or looking up fan in database. " + err);
        }
    });

    app.put('/fans/:userId', async (req, res, next) => {
        console.log("in /fans update route (PUT) with userId = " + JSON.stringify(req.params.userId) +
            " and body = " + JSON.stringify(req.body));
        if (!req.params.hasOwnProperty("userId")) {
            return res.status(400).send("fans/ PUT request formulated incorrectly." +
                "It must contain 'userId' as parameter.");
        }
        const validProps = ['password', 'displayName', 'profilePicURL',
            'securityQuestion', 'securityAnswer', 'venues', 'artists', 'genres', 'user'];
        for (const bodyProp in req.body) {
            if (!validProps.includes(bodyProp)) {
                return res.status(400).send("fan/ PUT request formulated incorrectly." +
                    "Only the following props are allowed in body: " +
                    "'password', 'displayname', 'profilePicURL', 'securityQuestion', 'securityAnswer', 'venues', 'artists', 'genres', and 'user'");
            }
        }
        try {
            let fan = await Fan.findOne({ 'user.id': req.params.userId })
            if (fan) {
                for (const [key, value] of Object.entries(req.body)) {
                    // Prevent user model from being completely over written and removing wanted properties
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
                return res.status(200).send("Fan account " + req.params.userId + " successfully updated.")
            } else {
                return res.status(404).send('Fan account ' + req.params.userId + ' not found')
            }
        } catch (err) {
            res.status(400).send("Unexpected error occurred when updating fan data in database: " + err);
        }
    });

    app.delete('/fans/:userId', async (req, res, next) => {
        console.log("in /fans route (DELETE) with userId = " +
            JSON.stringify(req.params.userId));
        try {
            let status = await Fan.deleteOne({ 'user.id': req.params.userId });
            if (status.deletedCount !== 1) {
                return res.status(404).send("No fan account " +
                    req.params.userId + " was found. Account could not be deleted.");
            } else {
                return res.status(200).send("Fan account " +
                    req.params.userId + " was successfully deleted.");
            }
        } catch (err) {
            return res.status(400).send("Unexpected error occurred when attempting to delete fan account with id " +
                req.params.userId + ": " + err);
        }
    });

}