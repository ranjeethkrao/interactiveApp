const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const getstreamApi = require('./magnitudinis-server/routes/getstream/getstream-api');


// Get our API routes
const api = require('./magnitudinis-server/routes/api');
const auth = require('./magnitudinis-server/routes/auth/auth');
const tradeRoute = require('./magnitudinis-server/routes/trade/trade');
const users = require('./magnitudinis-server/routes/users/users');

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
app.use('/user', users.users);
app.use('/getstream', getstreamApi.streamApi);

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

/**
 * Create Socket and listen for connections
 */
const io = require('socket.io')(server);
io.on('connection', function(socket){
    console.log('a user connected');
});

io.on('disconnect', function(socket){
    console.log('user disconnected');
});
tradeRoute.initialize(io);
  




