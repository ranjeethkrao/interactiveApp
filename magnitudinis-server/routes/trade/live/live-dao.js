const api = require('../../api');
const express = api.getExpress();
const router = express.Router();
const firebaseDB = api.getFirebaseDB();
const firebasePath = '/status/result/1/data';
liveTradeData = {};

firebaseDB.ref(firebasePath).on("child_changed", (snapshot)=>{
    liveTradeData[snapshot.ref.key]=snapshot.val();
});

router.get('/getAllExchange', (req, res) => {
    responseObject = [];
    firebaseDB.ref(firebasePath).once('value', (snapshot)=>{
        list = [...new Set(snapshot.val().map(item => item.Exchange))];
        list.forEach((element, index) => {
            responseObject.push({ID: index, VALUE: element})
        });
        return res.send(responseObject);
    });    
});

router.get('/getDistinctSymbol', (req, res) => {
    responseObject = [];
    queryParams = req.query['exchange'];
    if(queryParams){
        exchanges = queryParams.split(',');
        firebaseDB.ref(firebasePath).once('value', (snapshot)=>{
            exchanges.forEach(exchange=>{
                list = [...new Set(snapshot.val().filter(data=>data.Exchange === exchange))];
                list.forEach((element, index) => {
                    responseObject.push({ID: index, VALUE: element})
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

module.exports = {
    router : router
}