/**
 * Created by jianhua on 12/11/15.
 */

(function() {
	'use strict';

	app.controller('LoginCtrl', function ($scope, UserService) {
		$scope.user = {};
		$scope.login = function(user) {
			UserService.login(user).then(function (res) {
				UserService.setAuthHeader(res.data.token);
				$scope.navigateTo('tasks', {userId: 1});
			}, function (err) {
				console.error(err);
			});
		}
	});

	app.controller('TasksCtrl', function($scope, $stateParams, TaskLists, TaskServices) {
		var COLORS = ['amber', 'lightblue', 'lightyellow', 'green', 'red', 'white', 'purple'];

		$scope.taskLists = TaskLists;
		$scope.colors = COLORS;
		$scope.isOpen = false;

		$scope.taskList = {}; // object for new task list
		// default values
		$scope.taskList.public = false;
		$scope.taskList.color = 'amber';


		$scope.setColor = function(color) {
			$scope.taskList.color = color;
		};

		$scope.add = function(taskList) {
			// join the current logged in user
			angular.extend(taskList, {owner: $stateParams.userId});

			TaskServices.add(taskList).then(function(data) {
				// successfully added a task list, update scope task lists
				$scope.taskLists.push(data);
				// reset task list
				$scope.taskList = {};
			}, function(error) {
				console.log(error);
			})
		}
	});

	app.controller('TodoCtrl', function($scope, TodoService) {
		$scope.todo = {};
		$scope.showCheckedTodos = false;

		$scope.addTodo = function (list) {
			TodoService.add(list, $scope.todo).then(function (data) {
				list.todos.unshift(data);

				// reset the used todo object
				$scope.todo = {};
				// hide the add todo input
				$scope.showAddTodoInput = false;
			}, function(error) {
				console.log(error);
			});
		};

		$scope.update = function (list, todo) {
			TodoService.update(list, todo).then(function() {
				// updated
			}, function(error) {
				console.log(error);
			});
		}
	});
}());