angular.module('foodController', [])

	// inject the Food service factory into our controller
	.controller('mainController', ['$scope','$http','Food', function($scope, $http, Food) {
		$scope.formData = {};
		$scope.loading = true;

		// GET =====================================================================
		// when landing on the page, get all food items and show them
		// use the service to get all the food
		Food.get()
			.success(function(data) {
				$scope.food = data;
				$scope.loading = false;
				$scope.totalCost();
			});

		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createFood = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.text != undefined) {
				$scope.loading = true;

				// call the create function from our service (returns a promise object)
				Food.create($scope.formData)

					// if successful creation, call our get function to get all the new food
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.food = data; // assign our new list of food

						$scope.totalCost();
					});
			}
		};

		// DELETE ==================================================================
		// delete a food item after checking it
		$scope.deleteFood = function(id) {
			$scope.loading = true;

			Food.delete(id)
				// if successful creation, call our get function to get all the new food item
				.success(function(data) {
					$scope.loading = false;
					$scope.food = data; // assign our new list of food

					$scope.totalCost();
				});
		};

		$scope.totalCost = function() {
			$http.get('/api/total')
			   .success(function(data) {
				   $scope.finalPrice = Number(data);
			   })
		};
	}]);

