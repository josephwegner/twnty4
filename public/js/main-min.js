var app = angular.module('Twnty4App', []);


app.controller('Twnty4Ctrl', function($scope) {

	solving = false

	$scope.userSet = false;

	socket = io.connect();
	socket.on("win", function(data) {
		solving = false;
		$scope.$apply(function() {
			if($scope.userSet) {
				$scope.flash = {
					type: "success",
					message: "Nice job!",
					timestamp: Date.now()
				}
			}

			$scope.resetNumbers(data.numbers);
		});

	});
	socket.on("lose", function(data) {
		solving = false;
		$scope.$apply(function() {
			if($scope.userSet) {
				$scope.flash = {
					type: "error",
					message: "You lose!",
					timestamp: Date.now()
				}
			}

			$scope.resetNumbers(data.numbers);
		});
	});
	socket.on("numbers", function(data) {
		$scope.$apply(function() {
			if($scope.userSet && data.message) {
				$scope.flash = {
					type: "error",
					message: data.message,
					timestamp: Date.now()
				}
			}

			$scope.resetNumbers(data.numbers);
		});
		solving = false;
	});
	socket.on("cheater", function(data) {
		for(var i=0,max=data.messages.length; i<max; i++) {
			//alert(data.messages[i]);
		}
	});
	socket.on('users', function(data) {
		var sortedUsers = [];
		for(var i=0, max=data.users.length; i<max; i++) {
			var inserted = false;
			var score = data.users[i].score
			for(var j=0,jMax=sortedUsers.length; j<jMax; j++) {
				if(score > sortedUsers[j].score) {
					sortedUsers.splice(j, 0, data.users[i]);
					inserted = true;
					break;
				}
			}
			if(!inserted) {
				sortedUsers.push(data.users[i]);
			}
		}

		$scope.$apply(function() {
			$scope.users = sortedUsers;
		})
	});

	$scope.begin = function() {
		if(typeof($scope.username) !== "undefined" && $scope.username !== "") {
			socket.emit("register", {
				username: $scope.username
			});
			$scope.userSet = true;
		}
	}

	$scope.resetNumbers = function(newNumbers) {
		if(typeof(newNumbers) === "undefined") {
			newNumbers = [1,2,3,4];
		}

		$scope.options = newNumbers;
		$scope.selections = [0, 1, 2, 3];
		$scope.operations = ["add", "add", "add"];
	}

	$scope.total = function() {
		var currentValue = $scope.options[$scope.selections[0]];

		for(var i=0,max=$scope.options.length - 1; i<max; i++) {
			switch($scope.operations[i]) {
				case "add":
					currentValue += $scope.options[$scope.selections[i + 1]];

					break;

				case "subtract":
					currentValue -= $scope.options[$scope.selections[i + 1]];

					break;

				case "multiply":
					currentValue = currentValue * $scope.options[$scope.selections[i + 1]];

					break;

				case "divide":
					currentValue = currentValue / $scope.options[$scope.selections[i + 1]];

					break;
			}
		}

		if(currentValue === 24 && solving === false && $scope.userSet) {
			solving = true;

			numbers = [];
			for(var i=0; i<$scope.options.length; i++) {
				numbers.push($scope.options[$scope.selections[i]]);
			}

			socket.emit("solve", {
				numbers: numbers,
				operations: $scope.operations
			});
		}

		if(Math.round(currentValue) !== currentValue) {
			return "~"+Math.round(currentValue);
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