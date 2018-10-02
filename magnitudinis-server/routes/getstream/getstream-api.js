const stream = require('getstream');
const api = require('../api');
const express = api.getExpress();
const router = express.Router();
const config = require('./config');
var client = stream.connect(config.API_KEY, config.API_KEY.API_KEY, )
client = stream.connect(config.API_KEY, config.API_KEY_SECRET, config.APP_ID, { location: config.LOC });

router.get('/addActivity/:user', (req, res) => {
    let raoFeed = client.feed(config.FEED, req.params.user);
    activity = {actor: req.params.user, verb: 'tweet', 'object': 1, tweet: 'Hello ' + req.params.user + '!' };
    let k = raoFeed.addActivity(activity);
    res.send('ok')
});

router.get('/token/:user', (req, res) => {
    var token = client.feed(config.FEED, req.params.user).token;
    res.send(token)
});

module.exports = {
    streamApi: router
}