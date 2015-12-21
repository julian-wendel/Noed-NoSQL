/**
 * Created by nico on 24.11.15.
 */

'use strict';

var app = angular.module('NoedSQL', ['ngMaterial', 'ngMessages', 'ui.router', 'angular-jwt']);

app.run(function($rootScope, $state, $timeout, $mdToast, UserService, jwtHelper) {
	/**
	 * Redirects to the specified state.
	 * @param {string} to Absolute state name or relative state path.
	 * @param {object=} params A map of the parameters that will be sent to the state.
	 * @param {object=} options Options object.
	 */
	$rootScope.navigateTo = function(to, params, options) {
		$state.go(to, params, options);
	};

	$rootScope.$on('$stateChangeStart', function(evt, toState) {
		if (toState && toState.resolve)
			$rootScope.showLoading = true;

		// Check if the user is authenticated. When not, go back to login page, only if the current state
		// is not already on the way to login page. We don't want to check if the views which don't have
		if (toState && toState.data && toState.data.requiresLogin) {
			var token = UserService.getToken(),
				isExpired = token ? jwtHelper.isTokenExpired(token) : true;

			if (isExpired) {
				if (toState.name !== 'login') {
					evt.preventDefault();
					$state.go('login', {}, {reload: true});
				}
			} else {
				// authenticated, continue
			}
		}
	});

	$rootScope.$on('$stateChangeSuccess', function() {
		$timeout(function() { $rootScope.showLoading = false; }, 800);
	});

	/**
	 * Shows a toast information overlay at the top right corner.
	 * @param msg{string=} - the message to be passed.
	 */
	$rootScope.showToast = function(msg) {
		$mdToast.show(
			$mdToast.simple()
				.content(msg)
				.position('top right')
				.hideDelay(5000)
		);
	}
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
            templateUrl: "views/tasks.html",
            resolve: {
				TaskLists: function(TaskServices) {
                    return TaskServices.all();
                }
            },
			data: {
				requiresLogin: true
			},
            controller: 'TasksCtrl'
        });

    $urlRouterProvider.otherwise("/login");
    $httpProvider.interceptors.push('AuthInterceptor');
});