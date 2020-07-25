var router = require('express').Router();
var dataFields = require('../data.json')

router.get('/', function (req, res) {
  res.render('index');
});

router.get('/main',function(req,res){
	res.render('main');
});

router.get('/form',function(req,res,next){
	res.render('form');
});

router.post('/form',function(req,res,next){
    arr = []
    for(i in dataFields.headlines){
        str = dataFields.headlines[i];
        for(j in dataFields.fields){
            if(dataFields.fields[j] == "Number")
                str = str.replace("{"+dataFields.fields[j]+"}",((Math.floor(Math.random()) * (13-3)) + 3));
            else if(dataFields.fields[j] == "Period")
                str = str.replace("{"+dataFields.fields[j]+"}",(((Math.floor(Math.random()) * (13-3)) + 3)) + " Days ");
            else
                str = str.replace("{"+dataFields.fields[j]+"}",req.body[dataFields.fields[j]]);
        }
        arr.push(str);
    }
    res.render('app' , quotes = arr);
});

module.exports = router;