/**
 * Created by jianhua on 12/11/15.
 */

(function() {
	'use strict';

	app.factory('UserService', ['$q','$http', function($q, $http) {
		return {
			setAuthHeader: function(token){
				$http.defaults.headers.common['X-Auth'] = token;
			},

			login: function(data){
				var $d = $q.defer();
				$http({
					method: 'POST',
					url: '/api/token',
					data: data
				}).then(function(response) {
					$d.resolve(response);
				}, function(error) {
					$d.reject(error.message);
				});
				return $d.promise;
			}
		}
	}]);

	app.factory('TaskServices', function($q, $http) {
		var add = function(task) {
			var deferred = $q.defer();

			$http({
				method: 'POST',
				url: '/api/tasks',
				data: task
			}).then(function(res, status) {
				if (status === 201)
					deferred.resolve();
				else
					deferred.reject(status);
			}, function(error, status) {
				deferred.reject(status);
			})
		};

		var all = function(userId) {
			var deferred = $q.defer();

			$http({
				method: 'GET',
				url: '/api/tasks?userId=' + userId
			}).then(function(res, status) {
				if (status === 200)
					deferred.resolve(res);
				else
					deferred.reject(status);
			}, function(error, status) {
				deferred.reject(status);
			})
		};

		var getAllPublicTasks = function() {
			var deferred = $q.defer();

			$http({
				method: 'GET',
				url: '/api/tasks'
			}).then(function(res, status) {
				if (status === 200)
					deferred.resolve(res);
				else
					deferred.reject(status);
			}, function(error, status) {
				deferred.reject(status);
			})
		};

		var getTaskById = function(id) {
			var deferred = $q.defer();

			$http({
				method: 'GET',
				url: '/api/tasks?id=' + id
			}).then(function(res, status) {
				if (status === 200)
					deferred.resolve(res);
				else
					deferred.reject(status);
			}, function(error, status) {
				deferred.reject(status);
			})
		};

		var update = function(task) {
			var deferred = $q.defer();

			$http({
				method: 'PUT',
				url: '/api/tasks?id=' + task.id
			}).then(function(res, status) {
				if (status === 201)
					deferred.resolve();
				else
					deferred.reject(status);
			}, function(error, status) {
				deferred.reject(status);
			})
		};

		var remove = function(task) {
			var deferred = $q.defer();

			$http({
				method: 'DELETE',
				url: '/api/tasks?id=' + task.id
			}).then(function(res, status) {
				if (status === 200)
					deferred.resolve();
				else
					deferred.reject(status);
			}, function(error, status) {
				deferred.reject(status);
			})
		};

		return {
			add: add,
			all: all,
			update: update,
			remove: remove,
			getTaskById: getTaskById,
			getAllPublicTasks: getAllPublicTasks
		}
	});
}());