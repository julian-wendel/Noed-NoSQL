/**
 * Created by jianhua on 12/11/15.
 */

(function () {
    'use strict';

	// TODO rewrite the interceptor (current it causes problem if local storage is empty), add sign up, assign user on signing in
    app.factory('AuthInterceptor', function($rootScope, $q, jwtHelper) {
        return {
            'request': function (config) {
                console.log(config);
                if(localStorage.getItem('token'))
                    config.headers['x-auth-token'] = localStorage.getItem('token');

                if(!$rootScope.user)
                    $rootScope.user = jwtHelper.decodeToken(localStorage.getItem('token'));

                return config;
            },
            'responseError': function (rejection) {
                if(rejection.status == '401')
                    $rootScope.navigateTo('login');
                return $q.reject(rejection);
            }
        }
    });

    app.factory('UserService', ['$q', '$http', function ($q, $http) {
        return {
            setAuthHeader: function (token) {
                localStorage.setItem('token', token);
            },

            login: function (data) {
                var $d = $q.defer();
                $http({
                    method: 'POST',
                    url: '/api/token',
                    data: data
                }).then(function (response) {
                    if (response.status === 200)
                    	$d.resolve(response);
					else
						$d.reject(response.status);
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

        var update = function (list) {
            var deferred = $q.defer();

            $http({
                method: 'PUT',
                url: apiPath,
                params: {id: list._id, name: list.name, public: list.public, release: false} //TODO relese parameter to drop shared list
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
            //queryTodos: queryTodos,
            update: update,
            remove: remove,
            //getTaskById: getTaskById,
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
