var app = angular.module('BoilerApp', []);


app.controller('BoilerCtrl', function($scope, $http, $routeParams) {
	//This is a controller!
});
app.directive("element", function() {
	return {
		restrict: 'E',
		templateUrl: "/assets/templates/element.html",
		scope: {
		},
		link: function(scope, element, attrs) {

		}
	};
});