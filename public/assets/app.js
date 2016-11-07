"use strict";

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