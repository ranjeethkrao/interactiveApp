const api = require('../../api');
const express = api.getExpress();
const router = express.Router();
const firebaseDB = api.getFirebaseDB();
const firebasePath = '/status/result/1/data';
const async = require('async');
liveTradeData = {};

firebaseDB.ref(firebasePath).on("child_changed", (snapshot) => {
    liveTradeData[snapshot.ref.key] = snapshot.val();
});

router.get('/getAllExchange', (req, res) => {
    responseObject = [];
    firebaseDB.ref(firebasePath).once('value', (snapshot) => {
        if (snapshot.val()) {
            list = [...new Set(snapshot.val().map(item => item.Exchange))];
            list.forEach((element, index) => {
                responseObject.push({ ID: index, VALUE: element })
            });
            return res.send(responseObject);
        } else {
            return res.send(responseObject);
        }
    });
});

router.get('/getDistinctSymbol', (req, res) => {
    responseObject = [];
    queryParams = req.query['exchange'];
    if (queryParams) {
        exchanges = queryParams.split(',');
        firebaseDB.ref(firebasePath).once('value', (snapshot) => {
            exchanges.forEach(exchange => {
                list = [...new Set(snapshot.val().filter(data => data.Exchange === exchange))];
                list.forEach((element, index) => {
                    responseObject.push({ ID: index, VALUE: element })
                });
            })
            return res.send(responseObject);
        });
    }

});


router.get('/getLiveTradeData', (req, res) => {
    let responseObject = liveTradeData;
    liveTradeData = {};
    return res.send(responseObject);
});

router.get('/getSelectedItems/:email', (req, res) => {
    async.waterfall([
        function (callback) {
            firebaseDB.ref('users').once("value", function (snapshot) {
                var items = {};
                Object.keys(snapshot.val()).forEach(key => {
                    temp = snapshot.val()[key];
                    if (temp.email === req.params.email) {
                        items.exchange = temp.exchange || [];
                        items.symbols = temp.symbols || [];
                    }
                })
                callback(items);
            });
        }
    ], function (result, err) {
        res.send(result)
    });
});

router.post('/setSelectedItems/:email', (req, res) => {
    firebaseDB.ref('users').once("value", function (snapshot) {
        Object.keys(snapshot.val()).forEach(key => {
            temp = snapshot.val()[key];
            if (temp.email === req.params.email) {
                firebaseDB.ref('users/' + temp.username).update({ exchange: req.body.exchange, symbols: req.body.symbols }).then()
            }
        })
        res.send({ success: true });
    });

})

module.exports = {
    router: router
}