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

	app.controller('TasksCtrl', function($scope, $stateParams, TaskLists, TaskServices) {
		var COLORS = ['amber', 'lightblue', 'lightyellow', 'green', 'red', 'white', 'purple'];

		var randomColor = function() {
			return (COLORS[~~(Math.random() * COLORS.length)]);
		};


		$scope.taskLists = TaskLists;
		$scope.colors = COLORS;
		$scope.isOpen = false;

		$scope.taskList = {}; // object for new task list
		// default values
		$scope.taskList.public = false;
		$scope.taskList.color = '';


		$scope.setColor = function(color) {
			$scope.taskList.color = color;
		};

		$scope.add = function(taskList) {
			// join the current logged in user
			angular.extend(taskList, {owner: $stateParams.userId});

			TaskServices.add(taskList).then(function() {
				// successfully added a task list, update scope task lists
				$scope.taskLists.push(taskList);
				// reset task list
				$scope.taskList = {};
			}, function(error) {
				console.log(error);
			})
		}


		function createTodos() {
			console.log($scope.taskLists);
			for (var index=0; index<$scope.taskLists.length; index++) {
				var task = $scope.taskLists[index];

				console.log(task);
				task.todos = new Array();
				var count = Math.floor((Math.random() * 3) + 1);
				console.log(count);

				for(var i=0; i<count; i++) {
					task.todos.push({name: 'TODO ' + i});
				}
			}
		}
		createTodos();

		$scope.todo = {};
		$scope.todo.name;

		$scope.addTodo = function(list) {
			console.log(list);
			list.todos.push({name: $scope.todo.name});
		}
	});
}());