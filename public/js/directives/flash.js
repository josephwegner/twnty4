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