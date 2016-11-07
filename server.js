"use strict";

var express = require("express");
var bodyParser = require('body-parser');
//Require postgres client
var pgp = require("pg-promise")();
console.log('connecting to DB.');
var db = pgp(require("./db.json"));
var app = express();

// ROOT DIRECTORY
app.use('/', express.static(__dirname + '/public'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
//HTTP?
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


// **********saving new messages, addresses and first and last name
// *********from guest book form

app.post('/submit/weddingGuestFormInfo', function (req, res) {
  var params = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    addres: req.body.address,
    message: req.body.message
  };

  var boundParams = {
    userId: 1,
    weddingName: 'Johnson',
    params: JSON.stringify(params)
  };

  console.log('making query');
  db.query(
    'INSERT INTO guestBookEntry ("firstName", "lastName", "address", "message") VALUES (${firstName}, ${lastName}, ${address}, $(message)) RETURNING "guestBookEntryID"', 
    boundParams
  ).then(function (data) {
      console.log(data);
      var id = data[0].guestBookEntryID;
      res.send({
        status: 'success',
        id: id
      });
  }).catch(function (error) {
    console.log(error);
    res.status(500).send("Error with the database insert. " + JSON.stringify(error));
  });
});

 app.listen(3001, function () {
   console.log('See this website at localhost:3000');
 });

