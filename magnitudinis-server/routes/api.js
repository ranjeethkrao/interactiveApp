const express = require('express');
// const mysql = require('mysql');
const firebase = require('firebase-admin');
const serviceAccount = require('../firebase-auth/interactiveapp7-b4dba-firebase-adminsdk-bqv2d-6a1fe5b960.json');
const router = express.Router();

//Connect to mysql database
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'magnitudinis',
//     password: 'magnitudinis',
//     database: 'magnitudinis'
// });

// connection.connect((err) => {
//     if (!err) {
//         console.log("Database is connected...");
//     }
//     else {
//         console.error("Error connecting database...", err);
//     }
// });

const connection = null;

const config = {
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://interactiveapp7-b4dba.firebaseio.com"
};

firebase.initializeApp(config);
const firebaseDB = firebase.database();

console.log('Firebase initialized : ' + firebase.auth().app.name);

module.exports = {
    router: router,
    getExpress: function() {
        return express;
    },
    getDatabaseConnection: function() {
        return connection;
    },
    getFirebase: function() {
        return firebase;
    },
    getFirebaseDB: function() {
        return firebaseDB;
    }
};

