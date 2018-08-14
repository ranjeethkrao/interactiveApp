const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

// Get our API routes
const api = require('./magnitudinis-server/routes/api');
const auth = require('./magnitudinis-server/routes/auth/auth');
const tradeRoute = require('./magnitudinis-server/routes/trade/trade');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api.router);
app.use('/auth', auth.loginRoute);
app.use('/auth', auth.registerRoute);
app.use('/historic', tradeRoute.histTradeRoute);
app.use('/live', tradeRoute.liveTradeRoute);

// Catch all other routes and return the index file
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
* Get port from environment and store in Express.
*/
const port = process.env.PORT || '8080';
const host = process.host || 'localhost';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`Magnitudinis is running on \nhost : ${host} \nport : ${port}`));




