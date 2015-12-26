/**
 * Created by jianhua on 12/11/15.
 */

(function () {
    'use strict';

	app.factory('AuthInterceptor', function($rootScope, $q) {
        return {
            request: function (config) {
				var token = window.localStorage.getItem('token');

				// set authentication header for every outgoing request
				if(token)
					config.headers['x-auth-token'] = token;
				return config || $q.when(config);
            },

            responseError: function (rejection) {
				if(rejection.status === 401)
					$rootScope.navigateTo('login', {}, {reload: true});
                return $q.reject(rejection);
            }
        }
    });

    app.factory('UserService', ['$q', '$http', function ($q, $http) {
		var LOCAL_TOKEN_KEY = 'token';

		var setCredentials = function(token) {
			$http.defaults.headers.common['x-auth-token'] = token;
		};

		var getUserCredentials = function () {
			var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
			// no need to check if the token is valid as we will use http interceptor to handle it
			if (token) setCredentials(token);
		};

		getUserCredentials();

		var saveUserCredentials = function (token) {
			window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
			setCredentials(token);
		};

		var clearUserCredentials = function () {
			$http.defaults.headers.common['x-auth-token'] = undefined;
			window.localStorage.removeItem(LOCAL_TOKEN_KEY);
		};

        return {
            login: function (data) {
                var $d = $q.defer();
                $http({
                    method: 'POST',
                    url: '/api/token',
                    data: data
                }).then(function (res) {
                    if (res.status === 200) {
						saveUserCredentials(res.data.token);
						$d.resolve();
					} else
						$d.reject(res.status);
                }, function (error) {
					// clear user information
					clearUserCredentials();
                    $d.reject(error);
                });
                return $d.promise;
            },

			register: function (data) {
				var $d = $q.defer();
				$http({
					method: 'POST',
					url: '/api/users',
					data: data
				}).then(function (res) {
					if (res.status === 200) {
						$d.resolve();
					} else
						$d.reject(res.status);
				}, function (error) {
					$d.reject(error);
				});
				return $d.promise;
			},

			all: function() {
				var deferred = $q.defer();

				$http.get('/api/users').then(function (res) {
					if (res.status === 200)
						deferred.resolve(res.data);
					else
						deferred.reject(res.status);
				}, function (error, status) {
					deferred.reject(status);
				});
				return deferred.promise;
			},

			getToken: function() {
				// token contains current user's information. Needs to decode it using jwtHelper
				return window.localStorage.getItem(LOCAL_TOKEN_KEY) || '';
			},

			logout: function() {
				clearUserCredentials();
			}
        }
    }]);

    app.factory('TaskServices', function ($q, $http) {
        var apiPath = '/api/tasks';

        var add = function (task) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: apiPath,
                params: task
            }).then(function (res) {
                if (res.status === 200)
                    deferred.resolve(res.data);
                else
                    deferred.reject(res.status);
            }, function (error, status) {
                deferred.reject(status);
            });
            return deferred.promise;
        };

        var all = function () {
            var deferred = $q.defer();

            $http.get(apiPath).then(function (res) {
                if (res.status === 200) {
                    deferred.resolve(res.data);
                }
                else
                    deferred.reject(res.status);
            }, function (error, status) {
                deferred.reject(status);
            });
            return deferred.promise;
        };

        var getAllPublicTasks = function () {
            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: apiPath,
                params: {public: true}
            }).then(function (res) {
                if (res.status === 200)
                    deferred.resolve(res.data);
                else
                    deferred.reject(res.status);
            }, function (error, status) {
                deferred.reject(status);
            });

            return deferred.promise;
        };

        var update = function (list) {
            var deferred = $q.defer();

            $http({
                method: 'PUT',
                url: apiPath,
                params: {id: list._id, name: list.name, public: list.public}
            }).then(function (res) {
				if (res.status === 200)
                    deferred.resolve();
                else
                    deferred.reject(res.status);
            }, function (error, status) {
                deferred.reject(status);
            });

            return deferred.promise;
        };

        var remove = function (list) {
            var deferred = $q.defer();

            $http({
                method: 'DELETE',
                url: apiPath,
                params: {id: list._id}
            }).then(function (res) {
                if (res.status === 200)
                    deferred.resolve();
                else
                    deferred.reject(res.status);
            }, function (error, status) {
                deferred.reject(status);
            });
            return deferred.promise;
        };

        return {
            add: add,
            all: all,
            update: update,
            remove: remove,
            getAllPublicTasks: getAllPublicTasks
        }
    });

    app.factory('TodoService', function ($q, $http) {
        var apiPath = '/api/todos';

        var add = function (task, todo) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: apiPath,
                params: {_id: task._id, name: todo.name}
            }).then(function (res) {
                if (res.status === 200)
                    deferred.resolve(res.data);
                else
                    deferred.reject(res.status);
            }, function (error, status) {
                deferred.reject(status);
            });
            return deferred.promise;
        };

        var update = function (task, todo) {
            var deferred = $q.defer();
            $http({
                method: 'PUT',
                url: apiPath,
                params: {_id: task._id, _todoId: todo._id, done: todo.done, name: todo.name}
            }).then(function (res) {
                if (res.status === 200)
                    deferred.resolve();
                else
                    deferred.reject(res.status);
            }, function (error, status) {
                deferred.reject(status);
            });
            return deferred.promise;
        };

		var remove = function (list, todo) {
			var deferred = $q.defer();
			$http({
				method: 'DELETE',
				url: apiPath,
				params: {_id: list._id, _todoId: todo._id}
			}).then(function (res) {
				if (res.status === 200)
					deferred.resolve();
				else
					deferred.reject(res.status);
			}, function (error, status) {
				deferred.reject(status);
			});
			return deferred.promise;
		};

        return {
            add: add,
            update: update,
			remove: remove
        }
    });

}());
