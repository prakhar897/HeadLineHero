var router = require('express').Router();
var data = require('../config/data.js');

router.get('/', function(req, res) {
    res.render('index');
});


router.get('/main', function(req, res) {
    res.header("Cache-Control", "no-cache, no-store");
    res.render('main');
});

router.get('/form', function(req, res, next) {
    res.render('form');
});

router.post('/form', function(req, res, next) {
    titles = []
    console.log(req.body);
    var Keyword = req.body.Keyword;
    var Categories = req.body.categories;

    if(Categories == "All"){
        for(key in data){
            titles = titles.concat(data[key]);
        } 

        title_set = new Set(titles);
        titles = Array.from(title_set);
    }
    else{
        titles = data[Categories]
    }

    for(var i=0;i< titles.length;i++){
        titles[i] = titles[i].replace("{Keyword}","<strong>"+Keyword+"</strong>");
    }
    res.render('app', quotes = titles);
});

module.exports = router;