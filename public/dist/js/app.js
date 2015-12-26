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
		// 'data' key
		if (toState && toState.data && toState.data.requiresLogin) {
			var token = UserService.getToken();

			// no token found
			if (!token) {
				if (toState.name !== 'login') {
					evt.preventDefault();
					$state.go('login', {}, {reload: true});
				}
			} else {
				// token exists, check if it's still valid
				if (jwtHelper.isTokenExpired(token)) {
					if (toState.name !== 'login') {
						evt.preventDefault();
						$state.go('login', {}, {reload: true});
					}
				} else {
					// authenticated, continue routing
				}
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

/**
 * Directive that adds a class <code>.sticky</code> while scrolling page down.
 *
 * @Usage <ANY class="jh-sticky-header"></ANY>
 */
app.directive('jhStickyHeader', function () {
	var link = function(scope, element) {
		angular.element(window).bind('scroll', function () {
			var offset = window.pageYOffset || document.body.scrollTop;

			if (offset >= 70)
				element.addClass('sticky');
			else
				element.removeClass('sticky');
		})
	};

	return {
		restrict: 'C',
		link: link
	}
});

/**
 * Directive that simulates long press in a time interval and adds a shaking effect
 * to this directive's (element's) parent so that all its siblings get the same effect.
 * A callback function can be passed to this directive.
 *
 * @Usage <ANY jh-long-press="callback()"></ANY>
 */
app.directive('jhLongPress', function ($timeout) {
	var link = function (scope, elem, attrs) {
		var timer;
		elem.bind('mousedown touchstart', function() {
			timer = $timeout(function() {
				$timeout(function() {
					// eval callback
					scope.$eval(attrs.jhLongPress);
				}, 500);
				elem.parent().addClass('animated shake');
			}, 800);
		});

		elem.bind('mouseup touchend', function() {
			$timeout.cancel(timer);
			elem.parent().removeClass('animated shake');
		});
	};

	return {
		restrict: 'A',
		link: link
	}
});