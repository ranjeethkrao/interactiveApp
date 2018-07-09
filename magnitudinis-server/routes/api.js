const express = require('express');
// const mysql = require('mysql');
const firebase = require('firebase-admin');
const serviceAccount = require('../firebase-auth/magnitudinis-firebase-adminsdk-sicyx-84527be3da.json');
const router = express.Router();

//Connect to mysql database
/* const connection = mysql.createConnection({
    host: 'localhost',
    user: 'magnitudinis',
    password: 'magnitudinis',
    database: 'magnitudinis'
});

connection.connect((err) => {
    if (!err) {
        console.log("Database is connected...");
    }
    else {
        console.error("Error connecting database...", err);
    }
}); */

const config = {
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://magnitudinis.firebaseio.com"
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

