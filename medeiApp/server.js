var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./cfg');
var mongoose = require('mongoose');
var app=express();

// Connection to the database.
mongoose.connect(config.database, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("Successfully connected to database");
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(__dirname +'/frontend'));

var serverApi =require('./backend/routes/serverapi')(app, express);
app.use('/serverApi', serverApi);

app.get('*', function(req, res){
    res.sendFile(__dirname + '/frontend/app/views/index.html');
});

app.listen(config.port, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("Successfully connected to port 3000");
    }
});

