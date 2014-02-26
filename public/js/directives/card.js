app.directive("card", function() {
	return {
		restrict: 'E',
		templateUrl: "/assets/templates/card.html",
		scope: {
			options: "=options",
			selectedindex: "=selectedindex"
		},
		link: function(scope, element, attrs) {
			scope.selection = scope.options[scope.selectedindex];
		},
		controller: function($scope, $element, $attrs, $rootScope) {
			$scope.clicked = function(selected) {

				$scope.selection = $scope.options[selected];

				var previousSelectedIndex = $scope.selectedindex;
				$scope.selectedindex = selected;

				$rootScope.$broadcast("card_updated", selected, previousSelectedIndex, $element);
			}

			$scope.$watch("options", function() {
				$scope.selection = $scope.options[$scope.selectedindex];
			});

			$scope.$on("card_updated", function(ev, selected, previous, element) {
				if(element !== $element && selected === $scope.selectedindex && selected < $scope.options.length) {
					$scope.selection = $scope.options[previous];
					$scope.selectedindex = previous;
				}
			});
		}
	};
});