const https = require('https')
require('dotenv').config();

module.exports = function (app) {
    // GET route for google location search
    // Returns an Object containing information about the location
    app.get('/location/:search', async (req, res) => {
        // Properly encode search text for a URL
        const search = encodeURIComponent(req.params.search);
        console.log("in /location route (GET) search for: " + search)
        const url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" +
            search +
            "&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=" +
            process.env.GOOGLE_API_KEY;

        let request = new Promise((resolve, reject) => {
            https.get(url, (resp) => {
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                })

                resp.on('end', () => {
                    resolve(data)
                })
            }).on('error', (err) => {
                reject(err)
            })
        })
        try {
            let data = await request;
            let formattedData = JSON.parse(data)
            console.log(data);
            if (formattedData.status === 'OK') {
                return res.status(200).send(data);
            } else {
                return res.status(404).send('Location not found')
            }
        } catch (err) {
            return res.status(400).send(err)
        }
    })

    app.get('/map/:address', async (req, res) => {
        console.log("in /map route (GET) make url for: " + req.params.address);
        const encodedAddress = encodeURIComponent(req.params.address);
        return res.status(200).send("https://www.google.com/maps/embed/v1/place?key=" + process.env.GOOGLE_API_KEY + "&q=" + encodedAddress);
    })

}