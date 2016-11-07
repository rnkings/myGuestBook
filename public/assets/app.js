"use strict";

// BELOW IS TO HIDE LOGGIN after filled out
// AND SHOW THE NEXT form to fill out guest book

var app = angular.module('guestBook');
app.run(
	[
		"$rootScope", 
		function($rootScope){
			$rootScrope.loggedIn = false;
		}
	]
);



app.controller('SignInController', ['$rootscope', function ($rootScope)]{
  this.login = function(){
    $rootScope.loggedIn =true;
  };
});

// Below is creating tabs, if they are shown and fake hard coded message info

(function () {
	var app = angular.module('guestbook', []);

	app.controller('TabController', function () {
		this.tab = 2;

		this.showTab = function (tab) {
			this.tab = tab;
		};

		this.isShown = function (tab) {
			return this.tab === tab;
		};
	});

	app.controller('MessageController', function () {
		this.messages = [
			{
				message: 'You did it!',
				address: '123 Fake St',
				weddingInfo = [
					{
						date: 'January 5, 2018'
						invited: 208
						time: '7 a.m.'
						location: 'Botanical Gardens'
						letter: 'You ' + user.firstName + ' ' + user.lastName + 
						' ' + 'are invited to' + ' ' + user.weddingName;
						rvsp:
					}
				]
			},
			{
				message: 'Congrats sweetie!',
				address: '456 Fake St'
				weddingInfo = [
					{
						date: 'January 5, 2018'
						invited: 208
						time: '7 a.m.'
						location: 'Botanical Gardens'
						letter: 'You ' + user.firstName + ' ' + user.lastName + 
						' ' + 'are invited to' + ' ' + user.weddingName;
						rvsp:
					}
				]

			},
			{
				message: 'So glad to spend this special day with you!',
				address: '789 Fake St'
				weddingInfo = [
					{
						date: 'January 5, 2018'
						invited: 208
						time: '7 a.m.'
						location: 'Botanical Gardens'
						letter: 'You ' + user.firstName + ' ' + user.lastName + 
						' ' + 'are invited to' + ' ' + user.weddingName;
						rvsp:
					}
				]
			},
			{
				message: 'You two are perfect for each other',
				address: '999 Fake St'
				weddingInfo = [
					{
						date: 'January 5, 2018'
						invited: 208
						time: '7 a.m.'
						location: 'Botanical Gardens'
						letter: 'You ' + user.firstName + ' ' + user.lastName + 
						' ' + 'are invited to' + ' ' + user.weddingName;
						rvsp:
					}
				]
			}
		];

		this.newMessage = {};

		this.addMessage = function () {
			this.messages.push(this.newMessage);
			this.newMessage = {};
		}
	});
})();





