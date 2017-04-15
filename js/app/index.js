'use strict';

define(['jquery', 'underscore', 'backbone', 'text!templates/index.html'],
    function ($, _, Backbone, templateHTML) {
      return Backbone.View.extend({

        el: $('#main'),
        template: _.template(templateHTML),
        events: {
          'change input': 'handleFileSelect'
        },

        initialize: function () {
          this.render();
        },

        render: function () {
          this.$el.html(this.template);
          return this;
        },

        handleFileSelect: function (evt) {
          var files = evt.target.files;

          if (files && files[0]) {
            var reader = new FileReader();

            reader.addEventListener('load', this.handleFileLoad.bind(this));
            reader.readAsDataURL(files[0]);
          }
        },

        handleFileLoad: function (e) {
          console.log(e);
          return;
        }

      });
    }
);