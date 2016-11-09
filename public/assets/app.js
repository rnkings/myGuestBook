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

	this.setGuestBookEntries = function (entries) {
		this.entries = entries;
	};

	this.getGuestBookEntries = function () {
		return this.entries;
	};

	this.setInvitations = function (invitations) {
		this.invitations = invitations;
	};

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
	this.tab = 2;

	$scope.invitations = DataService.getInvitations();
	$scope.entries = DataService.getGuestBookEntries();
	$scope.wedding = DataService.getWedding();

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

		var data = {
			address: $scope.address,
			message: $scope.message,
			firstname: user.firstName,
			lastname: user.lastName,
			wedddingID: wedding.weddingID
		};
		// var newMessage = $scope.newMessage;

		$http({
			method: 'POST',
			url: '/submit/weddingGuestFormInfo',
			data: data
		})
		.then(function(data){
			console.log(data);
		})
		.catch(function(err){
			console.error(err);
		});
	}
}]);