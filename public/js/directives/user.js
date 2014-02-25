app.directive("user", function() {
	return {
		restrict: 'E',
		templateUrl: "/assets/templates/user.html",
		scope: {
			score: "@score",
			name: "@name"
		}
	};
});