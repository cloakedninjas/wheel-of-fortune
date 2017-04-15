var require = {
  baseUrl: 'js',
  waitSeconds: 0,

  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'Backbone'
    }
  },

  paths: {
    'jquery': 'libs/jquery-2.0.3.min',
    'underscore': 'libs/underscore.min',
    'backbone': 'libs/backbone.min',
    'text': 'libs/text',

    'indexView': 'app/index',
    'wheelView': 'app/wheel'
  }
};