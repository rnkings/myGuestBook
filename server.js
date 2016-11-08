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

app.post('/submit/signInForm', function (req, res) {
  var params = {
    firstname: req.body.firstname,
    lastname: req.body.lastname
  };

  console.log(req.body);
  console.log(req.query);

  console.log('making query');
  db.one(
  	'SELECT * FROM "user" WHERE "firstName" = ${firstname} AND "lastName" = ${lastname}',
  	params
  ).then(function (user) {
    var weddingParams = {
  	  weddingName: req.body.weddingname,
  	  userID: user.userID
    };
  	return db.one(
	  'SELECT "wedding".* FROM "wedding" INNER JOIN "invitation" ON ("wedding"."weddingID" = "invitation"."weddingID") WHERE "invitation"."userID" = ${userID} AND "wedding"."weddingName" = ${weddingName}',
	  weddingParams
	).then(function (wedding) {
	  res.send({
	  	user: user,
	  	wedding: wedding
	  });
	});
  }).catch(function (error) {
  	console.error(error);
  	res.status(404).send("Error with the database select. " + JSON.stringify(error));
  });
});

// **********saving new messages, addresses and first and last name
// *********from guest book form

app.post('/submit/weddingGuestFormInfo', function (req, res) {
  var params = {
    address: req.body.address,
    message: req.body.message,
    weddingID: req.body.weddingID,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  };

  console.log('making query');
  db.query(
    'INSERT INTO "guestBookEntry" ("address", "message", "weddingID", "firstName", "lastName") VALUES (${address}, ${message}, ${weddingID}, ${firstname}, ${lastname}) RETURNING "guestBookEntryID"', 
    params
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



 //get messages to tab

app.get('/guestBookEntries', function (req, res) {
  var id = req.query.weddingID;
  db.any('SELECT * FROM "guestBookEntry" WHERE "weddingID" = $1', [id])
    .then(function (results) {
      res.send(results);
    }).catch(function (error) {
      res.status(500).send('Error selecting from DB');
    });
});

//get wedding info

app.get('/invitations', function (req, res) {
  var id = req.query.weddingID;
  db.any('SELECT * FROM "invitation" WHERE "invitationID" = $1', [id])
  	.then(function (results) {
  		res.send(results);
  	}).catch(function (error) {
  		console.error(error);
  		res.status(500).send('Error selecting from DB');
  	});
});





app.listen(3001, function () {
  console.log('See this website at localhost:3001');
});

