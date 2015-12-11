/**
 * Created by nico on 24.11.15.
 */

var app = angular.module('NoedSQL', ['ngMaterial', 'ngMessages', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/login");
    //
    // Now set up the states
    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            controller: 'LoginCtrl'
        })
        .state('tasks', {
            url: "/tasks",
            templateUrl: "views/tasks.html",
            controller: 'TasksCtrl'
        });
});

app.factory('LoginSrv', ['$q','$http', function($q, $http){
    return {
        setAuthHeader: function(token){
            $http.defaults.headers.common['X-Auth'] = token;
        },

        login: function(data){
            var $d = $q.defer();
            $http({
                method: 'POST',
                url: './api/token',
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

app.controller('LoginCtrl', function($scope, $state, $http, LoginSrv) {
    $scope.username;
    $scope.password;

    $scope.login = function(){
        /*LoginSrv.login({username: $scope.username, password: $scope.password}).then(function(res){
            LoginSrv.setAuthHeader(res.data.token);
            $state.go('tasks');
        }, function(err){
            //TODO respond to user
        });*/
        
        $state.go('tasks');
    }
});

app.controller('TasksCtrl', function($scope) {
    $scope.tasks = new Array();
    $scope.colors = ['yellow', 'green', 'red', 'gray', 'purple', 'blue'];
    //for(var i=0; i<10; i++){
    //    $scope.tasks.push({name: 'List ' + i, color: $scope.colors[i % $scope.colors.length]});
    //}
});