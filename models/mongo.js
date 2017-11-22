const mongo = require('mongojs');
var db = mongo('news_scraper', ['myNews_finder']);

db.myNews_finder.insert({
    worked: true
});

db.myNews_finder.find({}, (err,docs) => {
    if (err){
        console.log(err);
        db.close();
        return;
    }
    console.log(docs);
    db.close();
});