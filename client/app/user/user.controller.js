(function() {
  'use strict';

  angular.module('postbucket')
    .controller('UserController', UserController);

  UserController.$inject = ['$state', 'UserService', 'PostService', 'userPosts'];

  function UserController($state, UserService, PostService, userPosts) {
    var userCtrl = this;
    userCtrl.user = {};
    userCtrl.user.username = UserService.user.username;
    userCtrl.loggedIn = UserService.loggedIn;
    userCtrl.loginError = UserService.loginError;
    userCtrl.posts = userPosts;

    if (!UserService.loggedIn) {
      var creds = UserService.getCredentials();
      if (creds) {
        UserService.useCredentials(creds);
        $state.reload();
      }
    }

    if (($state.current.name.includes('login') || $state.current.name.includes('signup')) && UserService.loggedIn)
      $state.go('pb.home', {}, {
        reload: true
      });

    userCtrl.loginUser = function(userLogin) {
      UserService.loginUser(userLogin).then(
        function(res) {
          if (res) {
            console.log('userCtrl.loginUser: res.data is:', res);
            UserService.loggedIn = true;
            $state.go('pb.home', {}, {
              reload: true
            });
          } else {
            UserService.loggedIn = false;
            UserService.loginError = true;
            $state.reload();
          }
        });
    };

    userCtrl.logoutUser = function() {
      UserService.logoutUser().then(
        function(res) {
          console.log('userCtrl.logoutUser: res.data is:', res);
          UserService.loggedIn = false;
          $state.go('pb.home', {}, {
            reload: true
          });
        });
    };

    userCtrl.createUser = function(userLogin) {
      UserService.createUser(userLogin).then(
        function(res) {
          if (res.err) {
            console.log('userCtrl.createUser: ERR. res.err exists and is: ', res.err);
            userCtrl.signupError = res.err.message; // show error message and then clear form
          } else {
            console.log('userCtrl.createUser: res.data is:', res.data);
            userCtrl.signupError = false;
            $state.go('pb.login', {}, {
              reload: true
            });
          }
        }
      );
    };

    userCtrl.deletePost = function(postId) {
      PostService.deletePost(postId).then(
        function(id) {
          if (id) {
            $state.reload();
          } else {
            console.log(new Error('Error deleting Post'));
            userCtrl.logoutUser();
            $state.go('pb.login', {}, {reload:true});
          }
        });
    };

  }

})();