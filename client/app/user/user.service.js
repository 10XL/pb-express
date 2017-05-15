(function() {
  'use strict';

  angular.module('postbucket')
    .service('UserService', UserService);

  UserService.inject = ['$http', 'ApiPath'];

  function UserService($http, ApiPath, $window) {
    var userSvc = this;
    userSvc.user = {};
    console.log('localStorage:', $window.localStorage);
    userSvc.loggedIn = false;

    userSvc.getCredentials = function() {
      if (!$window.localStorage.Token) return; // exit if no token
      var credentials = JSON.parse($window.localStorage.Token);
      console.log('userSvc.getCredentials : CREDENTIALS ARE:', credentials, credentials.username);
      if (credentials.username !== undefined)
        return credentials;
      else
        return false;
    };

    userSvc.useCredentials = function(credentials) {
      userSvc.user.username = credentials.username;
      var authToken = credentials.token;
      // Set the token as header for your requests!
      $http.defaults.headers.common['x-access-token'] = authToken;
      userSvc.loggedIn = true;
    };

    userSvc.loginUser = function(login) {
      return $http.post(ApiPath + 'user/login', login).then(
        function(res) {
          console.log('userSvc.loginUser: SUCCESS, res is:', res);
          userSvc.loggedIn = true;
          $window.localStorage['Token'] = JSON.stringify({
            username: login.username,
            token: res.data.token
          }); // store token
          $http.defaults.headers.common['x-access-token'] = res.data.token;
          return res.data;
        },
        function(err) {
          console.log('userSvc.loginUser: FAIL, res is:', err);
          userSvc.loggedIn = false;
          return false;
        });
    };

    userSvc.logoutUser = function() {
      return $http.get(ApiPath + 'user/logout').then(
        function(res) {
          console.log('userSvc.logoutUser: SUCCESS, res is:', res); // dev only
          userSvc.loggedIn = false;
          $http.defaults.headers.common['x-access-token'] = undefined;
          $window.localStorage.removeItem('Token'); // remove token
          return res.data;
        },
        function(err) {
          console.log('userSvc.logoutUser: FAIL, res is:', err); // dev only
          userSvc.loggedIn = true;
          return false;
        });
    };

    userSvc.createUser = function(login) {
      return $http.post(ApiPath + 'user/register', login).then(
        function(res) {
          console.log('userSvc.createUser: SUCCESS, res.data is:', res.data); // dev only
          return res.data;
        },
        function(err) {
          console.log('userSvc.createUser: FAIL, err.data is:', err.data); // dev only
          return err.data;
        });
    };
  }


})();