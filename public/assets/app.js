'use strict';

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

app.controller('SignInController', ['$rootScope', '$http', '$scope', function ($rootScope, $http, $scope) {
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
			$rootScope.loggedIn = true;
			$rootScope.user = response.data.user;
			$rootScope.wedding = response.data.wedding;
		}).catch(function (error) {
			alert("You did not type in the correct information.  Please try again.");
		});
		// $rootScope.loggedIn = true;
	};
}]);

// Below is creating tabs, if they are shown and fake hard coded message info

app.controller('TabController', function () {
	this.tab = 2;

	this.showTab = function (tab) {
		this.tab = tab;
	};

	this.isShown = function (tab) {
		return this.tab === tab;
	};
});

app.controller('EnteredInfoController', ['$http', '$scope', '$rootScope', function ($http, $scope, $rootScope) {
	this.addMessage = function () {
		var user = $rootScope.user;
		var wedding = $rootScope.wedding;
		$http({
			method: 'POST',
			url: '/submit/weddingGuestFormInfo',
			data: {
				address: $scope.address,
				message: $scope.message,
				firstname: user.firstname,
				lastname: user.lastname,
				weddingID: wedding.weddingID
			}
		}).then(function(data){
			alert('Success!');
			console.log(data);
		}).catch(function(error){
			console.error(error);
		});
	};
}]);

		// var newMessage = $scope.newMessage;

		// $http.post({
		// 		url: 'localhost:3001/submit/weddingGuestFormInfo',
		// 		data: {
		// 			address: $scope.address,
		//
		// 		}
		// 	})
		// 	.success(function(data){
		// 		$scope.message = data;
		// 	})
		// 	.error(function(err){
		// 		$log.error(err);
		// 	});
// 	}
// }]);