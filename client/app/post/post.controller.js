(function() {
  'use strict';

  angular.module('postbucket')
    .controller('PostController', PostController)
    .filter('highlight', function($sce) {
      return function(input, lang) {
        if (lang && input) return hljs.highlight(lang, input).value;
        return input;
      };
    })
    .filter('unsafe', function($sce) { return $sce.trustAsHtml; });

  PostController.$inject = ['$sce', '$state', 'PostService', 'post'];

  function PostController($sce, $state, PostService, post) {
    var postCtrl = this;
    postCtrl.post = post;
    postCtrl.expireTimes = PostService.expireTimes;
    postCtrl.syntax = PostService.syntax;
    if (post !== 404) {
      postCtrl.post.public = post.public || true;
      postCtrl.post.expireAt = postCtrl.post.expireAt || postCtrl.expireTimes[0];
      postCtrl.post.syntax = postCtrl.post.syntax || postCtrl.syntax[0];
    }
    // console.log('post is:', post);
    postCtrl.newPostError = false;

    postCtrl.createPost = function(newPost) {
      if (newPost.expireAt !== "Never") {
        var time = newPost.expireAt.split(' ');
        newPost.expireAt = moment().add(+time[0], time[1]).toISOString();
      } else newPost.expireAt = null;
      PostService.createPost(newPost).then(
        function(id) {
          if (id) {
            $state.go('pb.viewPost', {
              postId: id
            });
          } else {
            postCtrl.newPostError = true;
          }
        });
    };

  }

})();