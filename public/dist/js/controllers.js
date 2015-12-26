/**
 * Created by jianhua on 12/11/15.
 */

(function() {
	'use strict';

	app.controller('LoginCtrl', function ($scope, $timeout, UserService) {
		$scope.user = {};

		$scope.login = function(user) {
			UserService.login(user).then(function() {
				$scope.navigateTo('tasks');
			}, function () {
				$scope.showToast('Username and password don\'t match.');
			});
		};

		$scope.register = function(user) {
			var self = this;
			UserService.register(user).then(function() {
				$timeout(function() {
					$scope.showRegister = false;
					self.loginForm.$setPristine();
					delete $scope.user.name;
					delete $scope.user.firstName;
				});
			}, function () {
				$scope.showToast('Registration failed. The server returns an error. Please try again.');
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

		$scope.onLongPress = function() {
			$scope.showDelete = !$scope.showDelete;
		};

		/**
		 * Checks if the current logged in user is in a ng-repeat array. It will be filtered
		 * out of the array if it's already in.
		 * @param owners{Array} The owners of a task list array.
		 * @returns {boolean} True, if the owner doesn't equal to the current logged in user. Otherwise false.
		 */
		$scope.ownerFilter = function(owners) {
			return function(user) { // a user object in an array interation
				return (!angular.equals(user._id, $scope.currentUser.id) && owners.indexOf(user._id) > -1);
			}
		};

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
				delete $scope.taskList.name;
				delete $scope.taskList.public;
			}, function(error) {
				$scope.showToast('Error adding a task list.');
			});
		};

		$scope.update = function(list) {
			TaskServices.update(list).then(function() {
				// the list has been updated
			}, function() {
				$scope.showToast('Error updating the task list.');
			});
		};

		$scope.delete = function(list) {
			// remove the delete button first
			$scope.showDelete = false;
			// get the index of this list in the task lists
			var index = $rootScope.taskLists.indexOf(list);

			// check if the current user is the list's original owner. If not, just remove this list from view
			// and this user from owner list array in DB
			if (!angular.equals(list.owner[0], $scope.currentUser.id)) {
				TaskServices.update(list).then(function() {
					$timeout(function() {
						$rootScope.taskLists.splice(index, 1);
					}, 500);
				}, function(error) {
					$scope.showToast('Error updating the task list.');
				});

				return;
			}

			// remove this list both from the view and DB
			TaskServices.remove(list).then(function() {
				// successfully deleted the list, update scope
				$timeout(function() {
					$rootScope.taskLists.splice(index, 1);
				}, 500);
			}, function() {
				$scope.showToast('Error removing the task list.');
			});
		};

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
		 * Adds or removes the chosen shared list(s) to/from an array.
		 * @param list{object} The list to be added/removed.
		 */
		$scope.addToLists = function(list) {
			// get the index of this list in the task lists' array
			var index = $rootScope.taskLists.indexOf(list);

			TaskServices.update(list).then(function() {
				// the list has been updated, update the local scope
				if (index > -1)
					$rootScope.taskLists.splice(index, 1);
				else
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
						for (var j = 0; j < t.length; j++) {
							if (angular.equals(t[j]._id, todo._id)) {
								t.splice(j, 1);
								break;
							}
						}
					}
				}, 500);
			}, function(error) {
				$scope.showToast('Error deleting todo task.');
			});
		};
	});
}());