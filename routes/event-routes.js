
var mongoose = require('mongoose');
const Event = require('../models').Event;

module.exports = function (app) {

    app.get('/events/:eventId', async (req, res, next) => {
        console.log("In /events route (GET) with eventId = " + JSON.stringify(req.params.eventId));
        try {
            let thisEvent = await Event.findById(req.params.eventId);
            if (thisEvent) {
                return res.status(200).send(JSON.stringify(thisEvent));
            } else {
                return res.status(404).send("No event with eventId: " + req.params.eventId + " found in database")
            }
        } catch (err) {
            console.log(err)
            return res.status(400).send("Unexpected error during event retrieval")
        }
    });

    app.get('/events/search/:eventName', async (req, res, next) => {
        console.log("In /events/search route (GET) with eventName = " + JSON.stringify(req.params.eventName));
        try {
            let thisEvent = await Event.findOne({name: req.params.eventName});
            if (thisEvent) {
                return res.status(200).send(JSON.stringify(thisEvent));
            } else {
                return res.status(404).send("No event with name: " + req.params.eventName + " found in database")
            }
        } catch (err) {
            console.log(err)
            return res.status(400).send("Unexpected error during event retrieval")
        }
    });

    app.post('/events/:name', async (req, res, next) => {
        console.log("In /events route (POST) with params = " + JSON.stringify(req.params) +
        "and body" + JSON.stringify(req.body));
        if (req.body === undefined || 
            !req.body.hasOwnProperty("venueId") ||
            !req.body.hasOwnProperty("name") ||
            !req.body.hasOwnProperty("time") ||
            !req.body.hasOwnProperty("artists")) {
                return res.status(400).send("/events POST request formulated incorrectly" +
                " it must contain venueId, time, and artists")
            }
        
        try {
            console.log('New venues ID: ' +  req.body.venueId);
            let doc = await new Event({
                venueId: req.body.venueId,
                name: req.params.name,
                time: req.body.time,
                artists: req.body.artists
            }).save();
            return res.status(201).send(doc._id);
        } catch (err) {
            return res.status(400).send("Unexpected error occured when adding event to database")
        }
    });

    app.put('/events/:eventId', async (req, res, next) => {
        console.log("in /events update route (PUT) with eventId = " + JSON.stringify(req.params.eventId) +
        " and body = " + JSON.stringify(req.body));
        const validProps = ['artists', 'name', 'time'];
        for (const bodyProp in req.body) {
            if (!validProps.includes(bodyProp)) {
                return res.status(400).send('events/ PUT request formulated incorrectly.' +
                'only artists, name, and time are allowed in body');
            }
        }
        try {
            let oldEvent = await Event.findById(req.params.eventId);
            if (oldEvent) {
                for (const [key, value] of Object.entries(req.body)) {
                    oldEvent[key] = value;
                }
                await oldEvent.save();
                return res.status(200).send("Event " + req.params.eventId + " updated succesfully")
            } else {
                return res.status(404).send('Event ' + req.params.eventId + ' does not exist')
            }
        } catch(err) {
            console.log(err)
            return res.status(400).send("Unexpected error occured while updating event")
        }
    });
    
    app.delete('/events/:eventId', async (req, res, next) => {
        console.log("in /events route (DELETE) with eventId = " + req.params.eventId);
        try {
            let status = await Event.deleteOne({'_id': req.params.eventId});
            if (status.deletedCount !== 1) {
                return res.status(404).send("No event with id " + req.params.eventId + " found. Event not deleted");
            } else {
                return res.status(200).send("Event " + req.params.eventId + " successfully deleted")
            }
        } catch(err) {
            return res.status(400).send("Unexpected error occured when attempting to delete event " + req.params.eventId);
        }
    })
}
