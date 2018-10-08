const api = require('../../api');
const express = api.getExpress();
const router = express.Router();
const firebaseDB = api.getFirebaseDB();
const firebasePath = '/status/result/1/data';
const async = require('async');
liveTradeData = {};
index = 0;
var io;

firebaseDB.ref(firebasePath).on("child_changed", (snapshot) => {
    liveTradeData[snapshot.ref.key] = snapshot.val();
    io.emit('update', liveTradeData )
    liveTradeData = {};
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
        exchanges = [...new Set(queryParams.split(','))];
        exchanges.forEach(exchange => {
            
                firebaseDB.ref(firebasePath).once('value', (snapshot) => {
                    list = [...new Set(snapshot.val().filter(data => data.Exchange === exchange))];
                    let dataSet = [];
                    list.forEach(element => {
                        dataSet.push({ ID: index++, VALUE: element });
                    });
                    responseObject = responseObject.concat(dataSet);
                });
            
        })
        // console.log('responseObject', responseObject);
        
        return res.send(responseObject);

        // firebaseDB.ref(firebasePath).once('value', (snapshot) => {
        //     let index = 0;
        //     exchanges.forEach((exchange) => {
        //         list = [...new Set(snapshot.val().filter(data => data.Exchange === exchange))];
        //         let dataSet = [];
        //         list.forEach(element => {
        //             dataSet.push({ ID: index++, VALUE: element });                    
        //         });
        //         exchangeDataMap[exchange] = dataSet;
        //         responseObject = responseObject.concat(dataSet);

        //     })

        // });
    } else {
        return res.send(responseObject);
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
                callback(null, items);
            });
        }, function (userSelected, callback) {
            let exchanges = [];
            let symbols = [];
            firebaseDB.ref(firebasePath).once('value', (snapshot) => {
                if (snapshot.val()) {
                    //Build Exchange
                    let uniqueExchanges = [...new Set(snapshot.val().map(item => item.Exchange))];
                    uniqueExchanges.forEach((exchange, index) => {
                        if (userSelected.exchange.includes(exchange))
                            exchanges.push({ id: index, itemName: exchange })
                    });
                    //Build Symbols
                    let dataset = snapshot.val();
                    userSelected.symbols.forEach((symbol, index) => {
                        symbols.push({
                            id: index,
                            itemName: symbol,
                            data: dataset.filter(sym => sym.Symbol === symbol)[0]
                        });
                    })


                    callback({ exchange: exchanges, symbols: symbols });
                } else {
                    callback({ exchange: exchanges, symbols: symbols });
                }
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
    init: (sio) => {
        io = sio;
    },
    router: router
}