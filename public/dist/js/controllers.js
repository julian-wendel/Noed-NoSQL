/**
 * Created by jianhua on 12/11/15.
 */

(function() {
	'use strict';

	app.controller('LoginCtrl', function ($scope, UserService) {
		$scope.user = {};
		/*$scope.login = function(user) {
			UserService.login(user).then(function (res) {
				UserService.setAuthHeader(res.data.token);
				$scope.navigateTo('tasks', {userId: 1}); // replace with res.data.id
			}, function (err) {
				console.error(err);
			});
		}*/
		$scope.navigateTo('tasks', {userId: 1});
	});

	app.controller('TasksCtrl', function($scope, Tasks, TaskServices) {
		$scope.tasks = Tasks;
		var colors = ['yellow', 'green', 'red', 'gray', 'purple', 'blue'];
		var color = colors[~~(Math.random() * 10) % colors.length];

		for (var i = 0; i < $scope.tasks.length; i++) {
			angular.extend($scope.tasks[i], {color: color});
		}

		$scope.add = function(task) {
			TaskServices.add(task).then(function() {
				// successfull
			}, function(error) {
				console.log(error);
			})
		}
	});
}());