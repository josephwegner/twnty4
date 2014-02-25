var app = angular.module('Twnty4App', []);


app.controller('Twnty4Ctrl', function($scope, $http) {
	
	solving = false

	$scope.options = [1,2,5,4];
	$scope.selections = [
		$scope.options[0],
		$scope.options[1],
		$scope.options[2],
		$scope.options[3]
	];

	$scope.operations = ["add", "add", "add"];

	socket = io.connect();
	socket.on("win", function(data) {
		alert("you win!");
		solving = false;
	});
	socket.on("lose", function(data) {
		solving = false;
	});
	socket.on("numbers", function(data) {
		$scope.$apply(function() {
			$scope.options = data.numbers;
			$scope.selections = [
				$scope.options[0],
				$scope.options[1],
				$scope.options[2],
				$scope.options[3]		
			];
			$scope.operations = ["add", "add", "add"];
		});
		solving = false;
	});

	$scope.total = function() {
		var currentValue = false;

		for(var i=0,max=$scope.options.length - 1; i<max; i++) {
			if($scope.selections[i + 1] !== false) {
				if(currentValue === false) {
					currentValue = $scope.selections[i];
				}

				switch($scope.operations[i]) {
					case "add":
						currentValue += $scope.selections[i + 1];

						break;

					case "subtract":
						currentValue -= $scope.selections[i + 1];

						break;

					case "multiply":
						currentValue = currentValue * $scope.selections[i + 1];

						break;

					case "divide":
						currentValue += currentValue / $scope.selections[i + 1];

						break;
				}
			} else if($scope.selections[i] !== false && currentValue === false) {
				currentValue = $scope.selections[i];
			}
		}

		console.log(currentValue);
		if(currentValue === 24 && solving === false) {
			solving = true;
			socket.emit("solve", {numbers: $scope.selections});
		}

		return currentValue;
	}

});
app.directive("card", function() {
	return {
		restrict: 'E',
		templateUrl: "/assets/templates/card.html",
		scope: {
			options: "=options",
			selection: "=selection"
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
			operation: "=operation"
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