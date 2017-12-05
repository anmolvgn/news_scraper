var express = require('express');
var request = require('request');
var port = 3000;
var body_parser = require("body-parser");

var cheerio = require("cheerio");
let url = "https://www.nytimes.com/"
request(url, (error, response, html) => {
    var results = [];
    console.log('HTML:'+ html);

    let $ = cheerio.load(response);

    $("h2.story-heading, p.summary").each(function(i, element) {
        var headline = $(this).text();
        console.log('headline:'+ headline);

        var link = $(this)
            .children("a")
            .attr("href");
        console.log('link:' + link);

        var synopsis = $(this).siblings("p.summary").text();
        
        console.log('summary:'+synopsis);

        results.push({
            headline: headline,
            link: link,
            synopsis: synopsis
        });
    });

     console.log(JSON.stringify(results.data));
     //console.log(html);
});
//scraping tools-- axios promised-based http library similar to ajax method in jQuery
//axios works on both client and server

//var axios = require('axios');
var logger = require('morgan');
var mongoose = require('mongoose');
const mongo = require('mongojs');

var db = require("./models/mongo.js");

var app = express();

//app.use(logger("dev"));

app.use(body_parser.urlencoded({extended: false}));

app.use(express.static("public"));

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/news_scraper", {
    useMongoClient: true
});

//api routes

 app.get("/scrape", function(req, res) {
    
     cheerio.get('https://www.nytimes.com/').then(function(response){
         var $ = cheerio.load(html);
         $('.breaking-news-alerts alerts').each(function(i, element) {
             var result = {};

              result.Headline = $(this)
                 .children("a")
                 .attr("href");
            
            db.Headlines
                  .create(result)
                  .then(function(db) {
                      res.send('completed scrape');                    
                  })
                  .catch(function(err){
                      res.json(err);
                  })
            .push({
                 headline: headline,
                 link: link
             });
          });
      });
  });

 app.get("/Headlines", function(req, res) {
      db.Headlines
          .find({})
          .then(function(dbHeadlines){
             res.json(dbHeadlines);
          })
          .catch(function(err){
              res.json(err);
          });
 });

 app.get('/Headlines/:id', function(req, res) {
      db.Headlines
          .findOne({ _id: req.params.id })
          .populate("note")
          .then(function(dbHeadlines) {
              res.json(dbHeadlines);
          })

          .catch(function(err){
              res.json(err);
          });
 });

 app.post("/Headlines/:id", function(req, res) {
      db.Note
          .create(req.body)
          .then(function(dbNote) {
              return db.Headlines.findOneAndUpdate({ _id: req.params.id }, { Note: dbNote._id}, {new: true});            
          })
          .then(function(dbHeadlines){
              res.json(dbHeadlines);
          })
          .catch(function(err){
              res.json(err);
          });
  });

app.listen(port, function(){
    console.log('app running on port: '+ port);
});