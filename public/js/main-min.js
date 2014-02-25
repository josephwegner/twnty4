var app = angular.module('Twnty4App', []);


app.controller('Twnty4Ctrl', function($scope, $http) {
	
	solving = false

	socket = io.connect();
	socket.on("win", function(data) {
		solving = false;
		$scope.$apply(function() {
			$scope.flash = {
				type: "success",
				message: "Nice job!",
				timestamp: Date.now()
			}

			$scope.resetNumbers(data.numbers);
		});

	});
	socket.on("lose", function(data) {
		solving = false;
		$scope.$apply(function() {
			$scope.flash = {
				type: "error",
				message: "You lose!",
				timestamp: Date.now()
			}
			$scope.resetNumbers(data.numbers);
		});
	});
	socket.on("numbers", function(data) {
		$scope.$apply(function() {
			$scope.resetNumbers(data.numbers);
		});
		solving = false;
	});
	socket.on("cheater", function(data) {
		for(var i=0,max=data.messages.length; i<max; i++) {
			alert(data.messages[i]);
		}
	})

	$scope.resetNumbers = function(newNumbers) {
		if(typeof(newNumbers) === "undefined") {
			newNumbers = [1,2,3,4];
		}

		$scope.options = newNumbers;
		$scope.selections = [
			$scope.options[0],
			$scope.options[1],
			$scope.options[2],
			$scope.options[3]		
		];
		$scope.operations = ["add", "add", "add"];
		console.log($scope.options);
	}

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
						currentValue = currentValue / $scope.selections[i + 1];

						break;
				}
			} else if($scope.selections[i] !== false && currentValue === false) {
				currentValue = $scope.selections[i];
			}
		}

		if(currentValue === 24 && solving === false) {
			solving = true;
			socket.emit("solve", {
				numbers: $scope.selections,
				operations: $scope.operations
			});
		}

		return currentValue;
	}

	$scope.resetNumbers();

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

			$scope.$watch("options", function() {
				$scope.selectedIndex = -1;
				for(var i=0,max=$scope.options.length; i<max; i++) {
					if($scope.options[i] == $scope.selection) {
						$scope.selectedIndex = i;
						break;
					}
				}
			});

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
app.directive("flash", function() {
	return {
		restrict: 'E',
		templateUrl: "/assets/templates/flash.html",
		scope: {
			message: "@message",
			type: "@type",
			timestamp: "@timestamp"
		},
		controller: function($scope, $element, $attrs) {
			$scope.$watch("timestamp", function() {
				$element.addClass("phase1");
				setTimeout(function() {
					$element.removeClass("phase1").addClass("phase2");

					setTimeout(function() {
						$element.removeClass("phase2");
					}, 500);
				}, 500);
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