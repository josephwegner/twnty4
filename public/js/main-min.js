var app = angular.module('Twnty4App', []);


app.controller('Twnty4Ctrl', function($scope, $http) {
	//This is a controller!
});
app.directive("card", function() {
	return {
		restrict: 'E',
		templateUrl: "/assets/templates/card.html",
		scope: {
			options: "=options",
			selection: "@selection"
		},
		link: function(scope, element, attrs) {

			scope.selectedIndex = -1;
			for(var i=0,max=scope.options.length; i<max; i++) {
				if(scope.options[i] == scope.selection) {
					scope.selectedIndex = i;
					break;
				}
			}
		},
		controller: function($scope, $element, $attrs, $rootScope) {
			$scope.clicked = function(selected) {
				if(selected >= $scope.options.length) {
					$scope.selection = false;
				} else {
					$scope.selection = $scope.options[selected];
				}

				var previousSelectedIndex = $scope.selectedIndex;
				$scope.selectedIndex = selected;

				$rootScope.$broadcast("card_updated", selected, previousSelectedIndex, $element);
			}

			$scope.$on("card_updated", function(ev, selected, previous, element) {
				if(element !== $element && selected === $scope.selectedIndex && selected < $scope.options.length) {
					if(previous >= $scope.options.length) {
						$scope.selection = false;
					} else {
						$scope.selection = $scope.options[previous];
					}

					$scope.selectedIndex = previous;
				}
			});
		}
	};
});
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