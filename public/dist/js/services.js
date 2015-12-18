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
		var apiPath = '/api/tasks';

		var add = function(task) {
			var deferred = $q.defer();

			$http({
				method: 'POST',
				url: apiPath,
				params: task
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

        var addDefaults = function(createDefaults) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: apiPath,
                params: createDefaults
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

		var all = function(userId) {
			var deferred = $q.defer();

			$http({
				method: 'GET',
				url: apiPath
			}).then(function(res) {
				if (res.status === 200) {
                    if(res.data.isEmpty()){
                        addDefaults({createDefaults:true});
                        return all(userId);
                    }
                    else {
                        deferred.resolve(res.data);
                    }
                }
				else
					deferred.reject(res.status);
			}, function(error, status) {
				deferred.reject(status);
			});
			return deferred.promise;
		};

/*DEPRECATED
		var queryTodos = function() {
			var deferred = $q.defer();

			$http({
				method: 'GET',
				url: '/api/todos'
			}).then(function(res) {
				if (res.status === 200)
					deferred.resolve(res.data);
				else
					deferred.reject(res.status);
			}, function(error, status) {
				deferred.reject(status);
			});
			return deferred.promise;
		};*/

		var getAllPublicTasks = function() {
			var deferred = $q.defer();

			$http({
				method: 'GET',
				url: apiPath,
                params:{public:task.public}
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

		/*DEPRECATED
		var getTaskById = function(id) {
			var deferred = $q.defer();

			$http({
				method: 'GET',
				url: apiPath,
				params: {id: id}
			}).then(function(res) {
				if (res.status === 200)
					deferred.resolve(res.data);
				else
					deferred.reject(res.status);
			}, function(error, status) {
				deferred.reject(status);
			});

			return deferred.promise;
		};*/

		var update = function(task) {
			var deferred = $q.defer();

			$http({
				method: 'PUT',
				url: apiPath,
				params: {id: task.id, name:task.name, public:task.public, release:false} //TODO relese parameter to drop shared list
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
				url: apiPath,
				params: {id: task.id}
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

		var addTodo = function(task, todo) {
			var deferred = $q.defer();

			$http({
				method: 'DELETE',
				url: apiPath,
				params: {_id: task.id, name: todo.name}
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
			//queryTodos: queryTodos,
			update: update,
			remove: remove,
            addDefaults : addDefaults,
			//getTaskById: getTaskById,
			getAllPublicTasks: getAllPublicTasks
		}
	});
	app.factory('TodoService', function($q, $http) {
		var apiPath = '/api/todos';

		var add = function(task, todo) {
			var deferred = $q.defer();

			$http({
				method: 'POST',
				url: apiPath,
				params: {_id: task._id, name: todo.name}
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

		var update = function(task, todo) {
			var deferred = $q.defer();

			console.log(todo);
			$http({
				method: 'PUT',
				url: apiPath,
				params: {_id: task._id, _todoId: todo._id, done: todo.done, name: todo.name}
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

		return {
			add: add,
			update: update
		}
	});

	}());