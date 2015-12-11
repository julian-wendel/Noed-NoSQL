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
		/*var colors = ['yellow', 'green', 'red', 'gray', 'purple', 'blue'];

		 for(var i=0; i<10; i++){
		 $scope.tasks.push({name: 'List ' + i, color: colors[i % colors.length]});
		 }*/

		$scope.add = function(task) {
			TaskServices.add(task).then(function() {
				// successfull
			}, function(error) {
				console.log(error);
			})
		}
	});
}());