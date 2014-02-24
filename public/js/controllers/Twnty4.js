app.controller('Twnty4Ctrl', function($scope, $http) {
	
	$scope.options = [1,2,5,4];
	$scope.selections = [
		$scope.options[0],
		$scope.options[1],
		$scope.options[2],
		$scope.options[3]
	];

	$scope.operations = ["add", "add", "add"];

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

		return currentValue;
	}

});