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
  var firstName = req.body.firstname;
  var lastName = req.body.lastname;
  var weddingID = req.body.weddingID;
  var userID = req.body.userID;
  var message = req.body.message;
  var address = req.body.address;

  db
    .query(
      'UPDATE "invitation" SET "rsvp" = $1, "rsvpedDate" = NOW() WHERE "userID" = $2 AND "weddingID" = $3', 
      [req.body.rsvp, req.body.userID, weddingID]
    ).then(function () {
      return db.oneOrNone(
        'SELECT * FROM "guestBookEntry" WHERE "firstName" = $1 AND "lastName" = $2 AND "weddingID" = $3', 
        [firstName, lastName, weddingID]
      );
    }).then(function (entry) {
      if (entry !== null) {
        //TODO update
        return db.one(
          'UPDATE "guestBookEntry" SET "message" = $1, "address" = $2 WHERE "guestBookEntryID" = $3 RETURNING *', 
          [message, address, entry.guestBookEntryID]
        );
      } else {
        //TODO insert it
        return db.one(
          'INSERT INTO "guestBookEntry" ("address", "message", "weddingID", "firstName", "lastName") VALUES ($1, $2, $3, $4, $5) RETURNING *'
          [address, message, weddingID, firstName, lastName]
        );
      }
    }).then(function (entry) {
      res.send(entry);
    }).catch(function (error) {
      res.status(500).send(error);
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
  db.any('SELECT * FROM "invitation" WHERE "weddingID" = $1', [id])
    .then(function (invitations) {
      //TODO grab all users with invitations
      //TODO bind each user with invitation
      //TODO send back data

      var userIDs = invitations.map(function (invitation) {
        return invitation.userID;
      });

      return db.any('SELECT * FROM "user" WHERE "userID" IN ($1^)', pgp.as.csv(userIDs))
        .then(function (users) {
          invitations.forEach(function (invitation) {
            users.forEach(function (user) {
              if (user.userID === invitation.userID) {
                invitation.user = user;
              }
            });
          });
          res.send(invitations);
        });
    }).catch(function (error) {
      console.error(error);
      res.status(500).send('Error selecting from DB');
    });
});

app.listen(3001, function () {
  console.log('See this website at localhost:3001');
});

