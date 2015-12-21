/**
 * Created by jianhua on 12/11/15.
 */

(function() {
	'use strict';

	app.controller('LoginCtrl', function ($scope, UserService) {
		$scope.user = {};

		$scope.login = function(user) {
			UserService.login(user).then(function() {
				$scope.navigateTo('tasks');
			}, function () {
				$scope.showToast('Username and password don\'t match.');
			});
		}
	});

	app.controller('TasksCtrl', function($scope, $rootScope, $timeout, $filter, $mdDialog, $mdSidenav, TaskLists, TaskServices, UserService, jwtHelper) {
		var COLORS = ['amber', 'lightblue', 'lightyellow', 'green', 'red', 'white', 'purple'];
		// current logged in user
		$scope.currentUser = jwtHelper.decodeToken(UserService.getToken());

		$scope.toggleMenu = function() {
			$mdSidenav('left').toggle();
		};

		$scope.logout = function() {
			UserService.logout();
			$mdSidenav('left').close();
			$timeout(function() {
				$scope.navigateTo('login', {}, {reload: true});
			}, 500)
		};

		// TODO remove task list

		// iterate task lists to modify the daily list name
		for (var i = 0; i < TaskLists.length; i++) {
			var list = TaskLists[i];
			if (angular.equals(list.name, 'Daily')) {
				list.name = $filter('date')(Date.now(), 'dd.MM.yyyy EEEE');
				break;
			}
		}

		$rootScope.taskLists = TaskLists;
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
			TaskServices.add(taskList).then(function(data) {
				// successfully added a task list, update scope task lists
				$rootScope.taskLists.push(data);
				// reset task list
				$scope.taskList = {};
			}, function(error) {
				$scope.showToast('Error adding a task list.');
			});
		};

		$scope.update = function(list) {
			TaskServices.update(list).then(function() {
				// the has been updated
			}, function() {
				$scope.showToast('Error updating the task list.');
			});
		};

		/**
		 * Adds attribute 'user' to each task list in the array.
		 * @param arr{array} The list array to be given.
		 */
		/*var assignListToOwner = function(arr) {
			for (var i = 0; i < arr.length; i++) {
				var l = arr[i],
					users = l.owner;

				for (var j = 0; j < $scope.users.length; j++) {
					var user = $scope.users[j];
					if (users.indexOf(user._id) !== -1) {
						angular.extend(l, {user: user})
					}
				}
			}
		};*/

		// ------------------ get all users -------------- //

		$scope.users = [];
		var queryUsers = function() {
			UserService.all().then(function(users) {
				$scope.users = users;
			}, function(error) {
				$scope.showToast('Error retrieving users.');
			});
		};

		queryUsers();

		// ------------------ shared lists --------------- //

		$scope.publicLists = [];
		$scope.tempList = [];

		var queryPublicTaskLists = function() {
			$scope.showWaiting = false;

			TaskServices.getAllPublicTasks().then(function(lists) {
				$timeout(function() {
					$scope.publicLists = lists;
				});
			}, function (error) {
				$scope.showToast('Error retrieving public task lists.');
			});
		};

		$scope.showSharedListsDialog = function (ev) {
			$scope.showWaiting = true;
			// reset the temp list on opening the dialog
			$scope.tempList = [];

			$mdDialog.show({
				scope: $scope, // use parent scope, here is the current scope
				preserveScope: true, // must be true when using the current scope
				templateUrl: 'views/tasks.shared.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
				onComplete: queryPublicTaskLists
			});
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};

		/**
		 * Hides the dialog. It returns a promise after the dialog is hidden.
		 * @See method 'showSharedListsDialog()'
		 */
		$scope.hide = function() {
			$mdDialog.hide();
		};

		/**
		 * Adds the chosen shared list(s) to an array.
		 * @param list{object} The list to be added.
		 */
		$scope.addToLists = function(list) {
			/*var idx = $scope.tempList.indexOf(list);
			if (idx > -1) $scope.tempList.splice(idx, 1);
			else $scope.tempList.push(list);*/
			TaskServices.update(list).then(function() {
				// the list has been updated, update the local scope
				$rootScope.taskLists.unshift(list);
			}, function() {
				$scope.showToast('Error adding the selected list to your own list.');
			});
		};
	});

	app.controller('TodoCtrl', function($scope, $rootScope, $timeout, TodoService) {
		$scope.todo = {};
		$scope.showCheckedTodos = false;

		$scope.addTodo = function (list) {
			TodoService.add(list, $scope.todo).then(function (data) {
				list.todos.unshift(data);

				// reset the used todo object
				$scope.todo = {};
				// hide the add todo input field
				$scope.showAddTodoInput = false;
			}, function(error) {
				$scope.showToast('Error adding the todo task.');
			});
		};

		$scope.update = function (list, todo) {
			TodoService.update(list, todo).then(function() {
				// updated, do nothing
			}, function(error) {
				$scope.showToast('Error updating todo task.');
			});
		};

		$scope.delete = function(list, todo) {
			TodoService.remove(list, todo).then(function() {
				// removes the current task from local list
				$timeout(function() {
					for (var i = 0; i < $rootScope.taskLists.length; i++) {
						var l = $rootScope.taskLists[i],
							t = l.todos;
						t.splice(t.indexOf(todo._id));
					}
				}, 500);
			}, function(error) {
				$scope.showToast('Error deleting todo task.');
			});
		};
	});
}());