"use strict";

// BELOW IS TO HIDE LOGGIN after filled out
// AND SHOW THE NEXT form to fill out guest book

var app = angular.module('guestbook', []);
app.run(
	[
		'$rootScope',
		function ($rootScope) {
			$rootScope.loggedIn = false;
		}
	]
);

app.service('DataService', function () {
	this.user = {};
	this.wedding = {};
	this.entries = [];
	this.invitations = [];

	this.setUser = function (user) {
		this.user = user;
	};

	this.getUser = function () {
		return this.user;
	};

	this.setWedding = function (wedding) {
		this.wedding = wedding;
	};

	this.getWedding = function () {
		return this.wedding;
	};

	this.newEntry = function (newEntry) {
		var found = false;
		var entries = this.entries.map(function (entry) {
			if (entry.guestBookEntryID === newEntry.guestBookEntryID) {
				found = true;
				return newEntry;
			}
			return entry;
		});
		if (!found) {
			entries.push(newEntry);
		}

		this.entries = entries;
	};

	this.updateRSVP = function (userID, weddingID, rsvp) {
		var invitations = this.invitations.map(function (invitation) {
			console.log(invitation);
			if (invitation.weddingID === weddingID && invitation.userID === userID) {
				console.log(invitation.rsvp);
				invitation.rsvp = rsvp;
				console.log('Found it!!!');
				console.log(invitation.rsvp);
			}
			return invitation;
		});

		this.invitations = invitations;
	};

	this.setGuestBookEntries = function (entries) {
		this.entries = entries;
	};

	this.getGuestBookEntries = function () {
		return this.entries;
	};

	this.setInvitations = function (invitations) {
		this.invitations = invitations;
	};

	this.getNumberRsvp = function (rsvp){
		var count = 0;
		this.getInvitations().forEach(function (invitation) {
			if (invitation.rsvp !== null) {
				count++;
			}
		});
		return count;
	}

	this.getInvitations = function () {
		return this.invitations;
	};
});

app.controller('SignInController', ['DataService', '$http', '$scope', '$rootScope', function (DataService, $http, $scope, $rootScope) {
	//we use self inside the "then" callback
	var self = this;
	this.login = function () {
		$http({
			method: 'POST',
			url: '/submit/signInForm',
			data: {
				firstname: $scope.firstname,
				lastname: $scope.lastname,
				weddingname: $scope.weddingname
			}
		}).then(function (response) {
			console.log(response);
			//Set us as logged in
			$rootScope.loggedIn = true;
			//Set our data
			DataService.setUser(response.data.user);
			DataService.setWedding(response.data.wedding);
			//Load more data via controller methods.
			self.loadGuestbookData();
			self.loadInvitationData();
		}).catch(function (error) {
			console.error(error);
		});
		// $rootScope.loggedIn = true;
	};

	this.loadGuestbookData = function () {
		$http({
			method: 'GET',
			url: '/guestBookEntries?weddingID=' + DataService.getWedding().weddingID
		}).then(function (response) {
			console.log(response);
			DataService.setGuestBookEntries(response.data);
		}).catch(function (error) {
			alert(error.toString());
		});
	};

	this.loadInvitationData = function () {
		$http({
			method: 'GET',
			url: '/invitations?weddingID=' + DataService.getWedding().weddingID
		}).then(function (response) {
			console.log(response);
			DataService.setInvitations(response.data);
		}).catch(function (error) {
			alert(error.toString());
		});
	};
}]);

// Below is creating tabs, if they are shown and fake hard coded message info


app.controller('TabController', ['DataService', '$scope', function (DataService, $scope) {
	this.tab = 1;

	this.service = DataService;

	this.showTab = function (tab) {
		this.tab = tab;
	};

	this.isShown = function (tab) {
		return this.tab === tab;
	};
}]);

app.controller('EnteredInfoController', ['$http', '$scope', 'DataService', function ($http, $scope, DataService) {
	this.addMessage = function () {
		var user = DataService.getUser();
		var wedding = DataService.getWedding();

		var rsvp = $scope.rsvp ? true : false;
		console.log(rsvp);

		var data = {
			address: $scope.address,
			message: $scope.message,
			firstname: user.firstName,
			lastname: user.lastName,
			weddingID: wedding.weddingID,
			rsvp: rsvp,
			userID: user.userID
		};

		// console.log(message);
		// var newMessage = $scope.newMessage;

		$http({
			method: 'POST',
			url: '/submit/weddingGuestFormInfo',
			data: data
		})
		.then(function(response){
			DataService.newEntry(response.data);
			DataService.updateRSVP(user.userID, wedding.weddingID, rsvp);
		})
		.catch(function(err){
			console.error(err);
		});
	}
}]);