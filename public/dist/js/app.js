/**
 * Created by nico on 24.11.15.
 */

'use strict';

var app = angular.module('NoedSQL', ['ngMaterial', 'ngMessages', 'ui.router', 'angular-jwt']);

app.run(function($rootScope, $state) {
	/**
	 * Redirects to the specified state.
	 * @param {string} to Absolute state name or relative state path.
	 * @param {object=} params A map of the parameters that will be sent to the state.
	 * @param {object=} options Options object.
	 */
	$rootScope.navigateTo = function(to, params, options) {
		$state.go(to, params, options);
	};
});

app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            controller: 'LoginCtrl'
        })
        .state('tasks', {
            url: "/tasks",
            params: {userId: ':userId'},
            templateUrl: "views/tasks.html",
            resolve: {
				TaskLists: function(TaskServices, $stateParams) {
                    return TaskServices.all($stateParams.userId);
                }
            },
            controller: 'TasksCtrl'
        });

    $urlRouterProvider.otherwise("/tasks");
    $httpProvider.interceptors.push('AuthInterceptor');
});