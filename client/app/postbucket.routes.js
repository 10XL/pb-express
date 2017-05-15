(function() {
  'use strict';

  angular.module('postbucket')
    .config(Routes);

  Routes.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider'];

  function Routes($stateProvider, $locationProvider, $urlRouterProvider) {

    $stateProvider
      .state('pb', {
        abstract: true,
        views: {
          'header': {
            templateUrl: 'app/header.html',
            controller: 'UserController as $ctrl',
            resolve: {
              userPosts: [function() {
                return [];
              }]
            }
          },
          'postbucket': {
            templateUrl: 'app/postbucket.html',
            controller: function(postList) {
              var vm = this;
              vm.recentPosts = postList;
            },
            controllerAs: 'pbCtrl',
            resolve: {
              postList: ['PostService', function(PostService) {
                return PostService.getPosts();
              }]
            }
          },
          'footer': {
            templateUrl: 'app/footer.html',
          }
        }
      })
      .state('pb.home', {
        url: '/',
        templateUrl: 'app/post/templates/post-new.html',
        controller: 'PostController as postCtrl',
        resolve: {
          post: [function() {
            return {};
          }]
        }
      })

    .state('pb.latestPosts', {
        url: '/latest',
        templateUrl: 'app/post/templates/post-list.html',
        controller: function(postArchive) {
          var vm = this;
          vm.posts = postArchive;
        },
        controllerAs: 'archiveCtrl',
        resolve: {
          postArchive: ['PostService', function(PostService) {
            return PostService.getLatestPosts();
          }]
        }
      })
      .state('pb.myPosts', {
        url: '/mine',
        templateUrl: 'app/post/templates/post-user.html',
        controller: 'UserController as $ctrl',
        resolve: {
          userPosts: ['PostService', function(PostService) {
            return PostService.getMyPosts();
          }]
        }
      })

    .state('pb.signup', {
        url: '/user/signup',
        templateUrl: 'app/user/templates/user-signup.html',
        controller: 'UserController',
        controllerAs: '$ctrl',
        resolve: {
          userPosts: [function() {
            return [];
          }]
        }
      })
      .state('pb.login', {
        url: '/user/login',
        templateUrl: 'app/user/templates/user-login.html',
        controller: 'UserController as $ctrl',
        resolve: {
          userPosts: [function() {
            return [];
          }]
        }
      })


    .state('pb.user', {
        url: '/user/{username}',
        templateUrl: 'app/user/templates/user.html',
        controller: function(userPosts, $stateParams) {
          console.log('pb.user IS', userPosts);
          this.posts = userPosts;
          this.username = $stateParams.username;
        },
        controllerAs: '$ctrl',
        resolve: {
          userPosts: ['$stateParams', 'PostService', function($stateParams, PostService) {
            return PostService.getUserPosts($stateParams.username);
          }]
        }
      })
      .state('pb.viewPost', {
        url: '/{postId}',
        templateUrl: 'app/post/templates/post.html',
        controller: 'PostController as postCtrl',
        resolve: {
          post: ['$stateParams', 'PostService', function($stateParams, PostService) {
            if ($stateParams.postId === '') return {};
            return PostService.getPost($stateParams.postId);
          }]
        }
      });

    $urlRouterProvider.otherwise('/');
  }
})();