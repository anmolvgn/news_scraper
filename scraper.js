var express = require('express');
var request = require('request');
var port = 3000;
var body_parser = require("body-parser");

//scraping tools-- axios promised-based http library similar to ajax method in jQuery
//axios works on both client and server
var axios = require('axios');
var logger = require('morgan');
var mongoose = require('mongoose');
//const mongo = require('mongojs');

var db = require('./models');

var app = express();

app.use(logger("dev"));

app.use(body_parser.urlencoded({extended: false}));

app.use(express.static("'public"));

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/news_scraper", {
    useMongoClient: true
});

//api routes

app.get("/scrape", function(req, res) {
    
    axios.get('http://www.echojs.com').then(function(response){
        var $ = cheerio.load(response.data);

        $.('').each(function(i, element) {
            var result = {};

            result.title = $(this)
                .children("a")
                .attr("href");
            
            db.//''//
                .create(result)
                .then(function(db) {
                    res.send('completed scrape');                    
                })
                .catch(function(err){
                    res.json(err);
                });
        });
    });
});

app.get("/articles", function(req, res) {
    db.article
        .find({})
        .then(function(dbArticle){
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err);
        });
});

app.get('/articles/:id', function(req, res) {
    db.article
        .findOne({ _id: req.params.id })
        .populate("note")
        .then(function(dbArticle) {
            res.json(dbArticle);
        })

        .catch(function(err){
            res.json(err);
        });
});

app.post("/articles/:id", function(req, res) {
    db.Note
        .create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { Note: dbNote._id}, {new: true});            
        })
        .then(function(dbArticle){
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err);
        });
});

app.listen(port, function(){
    console.log('app running on port: '+ port);
});