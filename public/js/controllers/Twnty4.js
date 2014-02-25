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