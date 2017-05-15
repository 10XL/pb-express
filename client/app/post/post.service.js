(function() {
  'use strict';

  angular.module('postbucket')
    .service('PostService', PostService);

  PostService.inject = ['$http', 'ApiPath'];

  function PostService($http, ApiPath) {
    var postSvc = this;
    postSvc.expireTimes = ["Never", "10 Minutes", "1 Hour", "1 Day", "1 Week", "2 Weeks", "1 Month"];
    postSvc.syntax = ["None", "Apache", "Bash", "CSS", "Coffeescript", "Cpp", "Csharp", "Diff", "HTML", "HTTP", "Ini", "JSON", "Java", "Javascript", "Makefile", "Markdown", "Nginx", "ObjectiveC", "PHP", "Perl", "Python", "Ruby", "SQL", "Shell", "XML"];

    postSvc.getPost = function(postId) {
      // console.log("postSvc.getPost():post ID is:", postId);
      return $http({
        url: ApiPath + 'post/' + postId
      }).then(function(res) {
          // console.log('postSvc.getPost():res.data is', res.data);
          return res.data;
        },
        function(err) {
          return err.status;
        });
    };

    postSvc.getPosts = function() {
      // console.log("getting last 10 public posts");
      return postSvc.getPost('');
    };

    postSvc.getLatestPosts = function() {
      return $http({
        url: ApiPath + 'post/latest'
      }).then(function(res) {
        // console.log('res.data is', res.data);
        return res.data;
      });
    };

    postSvc.getMyPosts = function() {
      return $http({
        url: ApiPath + 'post/mine'
      }).then(function(res) {
        // console.log('res.data is', res.data);
        return res.data;
      }, function(err) {
        return err.status;
      });
    };

    postSvc.getUserPosts = function(user) {
      return $http({
        url: ApiPath + 'user/' + user + '/posts'
      }).then(function(res) {
          // console.log('res.data is', res.data);
          return res.data;
        },
        function(err) {
          return err.status;
        });
    };

    postSvc.createPost = function(post) {
      return $http.post(ApiPath + 'post/', post).then(
        function(res) {
          // console.log('success callback', res);
          return res.data.post._id;
        },
        function(res) {
          return false;
        });
    };

    postSvc.deletePost = function(postId) {
      return $http.delete(ApiPath + 'post/' + postId).then(
        function(res) {
          // console.log('Delete Success!');
          return 'Success';
        },
        function(res) {
          return false;
        });
    };
  }

})();