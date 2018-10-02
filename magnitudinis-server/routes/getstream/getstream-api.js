const stream = require('getstream');
const api = require('../api');
const express = api.getExpress();
const router = express.Router();
const config = require('./config');
var client = stream.connect(config.API_KEY, config.API_KEY.API_KEY, )
client = stream.connect(config.API_KEY, config.API_KEY_SECRET, config.APP_ID, { location: config.LOC });
const readonlyToken = client.feed(config.FEED, 'rao').getReadOnlyToken();

router.get('/addActivity', (req, res) => {
    let raoFeed = client.feed(config.FEED, 'rao');
    activity = {actor: 'rao', verb: 'tweet', 'object': 1, tweet: 'Hello Rao!'};
    let k = raoFeed.addActivity(activity);
    res.send('ok')
});

router.get('/token', (req, res) => {
    var token = client.feed(config.FEED, 'rao').token;
    res.send(token)
})

module.exports = {
    streamApi: router
}