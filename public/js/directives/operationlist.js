app.directive("operationlist", function() {
	return {
		restrict: 'E',
		templateUrl: "/assets/templates/operationlist.html",
		scope: {
			operation: "@operation"
		},
		link: function(scope, element, attrs) {

			if(typeof(attrs.operation) === "undefined") {
				attrs.operation = "add";
			}

			scope.clicked = function(operation) {
				scope.operation = operation;
			}

		}
	};
});