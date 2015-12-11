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
			}).then(function(res) {
				if (res.status === 201)
					deferred.resolve();
				else
					deferred.reject(res.status);
			}, function(error, status) {
				deferred.reject(status);
			});
			return deferred.promise;
		};

		var all = function(userId) {
			var deferred = $q.defer();

			$http({
				method: 'GET',
				url: '/api/tasks?owner=' + userId
			}).then(function(res) {
				if (res.status === 200)
					deferred.resolve(res.data);
				else
					deferred.reject(res.status);
			}, function(error, status) {
				deferred.reject(status);
			});
			return deferred.promise;
		};

		var getAllPublicTasks = function() {
			var deferred = $q.defer();

			$http({
				method: 'GET',
				url: '/api/tasks'
			}).then(function(res) {
				if (res.status === 200)
					deferred.resolve(res.data);
				else
					deferred.reject(res.status);
			}, function(error, status) {
				deferred.reject(status);
			});

			return deferred.promise;
		};

		var getTaskById = function(id) {
			var deferred = $q.defer();

			$http({
				method: 'GET',
				url: '/api/tasks?id=' + id
			}).then(function(res) {
				if (res.status === 200)
					deferred.resolve(res.data);
				else
					deferred.reject(res.status);
			}, function(error, status) {
				deferred.reject(status);
			});

			return deferred.promise;
		};

		var update = function(task) {
			var deferred = $q.defer();

			$http({
				method: 'PUT',
				url: '/api/tasks?id=' + task.id
			}).then(function(res) {
				if (res.status === 201)
					deferred.resolve();
				else
					deferred.reject(res.status);
			}, function(error, status) {
				deferred.reject(status);
			});

			return deferred.promise;
		};

		var remove = function(task) {
			var deferred = $q.defer();

			$http({
				method: 'DELETE',
				url: '/api/tasks?id=' + task.id
			}).then(function(res) {
				if (res.status === 200)
					deferred.resolve();
				else
					deferred.reject(res.status);
			}, function(error, status) {
				deferred.reject(status);
			});
			return deferred.promise;
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