(function() {
  'use strict';

  angular.module('postbucket', ['ui.router', 'angularMoment', 'hljs'])
    .constant('ApiPath', 'https://localhost:3443/')
    .config(function(hljsServiceProvider) {
      hljsServiceProvider.setOptions({
        // replace tab with 4 spaces
        tabReplace: '    '
      });
    });

})();