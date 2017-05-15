(function() {
  'use strict';

  angular.module('postbucket', ['ui.router', 'angularMoment', 'hljs'])
    .constant('ApiPath', 'https://postbucket-express.herokuapp.com/')
    .config(function(hljsServiceProvider) {
      hljsServiceProvider.setOptions({
        // replace tab with 4 spaces
        tabReplace: '    '
      });
    });

})();