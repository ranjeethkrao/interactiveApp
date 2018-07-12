const api = require('../../api');
const express = api.getExpress();
const router = express.Router();
const firebaseDB = api.getFirebaseDB();

router.get('/getAllExchange', (req, res) => {
    responseObject = [];
    firebaseDB.ref('/status/result/1/data').on('value', (snapshot)=>{
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
        firebaseDB.ref('/status/result/1/data').on('value', (snapshot)=>{
            exchanges.forEach(exchange=>{
                list = [...new Set(snapshot.val().filter(data=>data.Exchange === exchange))];
                list.forEach((element, index) => {
                    responseObject.push({ID: index, VALUE: element.Symbol})
                });
            })
            return res.send(responseObject);
        });
    }
       
});

module.exports = {
    router : router
}