'use strict';

define(['jquery', 'underscore', 'backbone', 'text!templates/index.html'],
    function ($, _, Backbone, templateHTML) {
      var IndexView = Backbone.View.extend({

        template: _.template(templateHTML),
        events: {
          'change input': 'handleFileSelect',
          'click button.submit': 'handleFormSubmit',
          'click button.add': 'handleAddItem',
          'click a.delete': 'handleRemoveItem'
        },

        $list: null,

        initialize: function () {
          this.render();
          this.$list = this.$('#items');
        },

        render: function () {
          this.$el.html(this.template);
          document.getElementById('main').appendChild(this.el);
          return this;
        },

        handleFileSelect: function (evt) {
          var files = evt.target.files;

          if (files && files[0]) {
            var reader = new FileReader();

            reader.addEventListener('load', this.handleFileLoad.bind(this));
            reader.readAsText(files[0]);
          }
        },

        handleFileLoad: function (e) {
          var data = e.target.result,
              list = data.split('\n'),
              wrapper = this.$('.wrapper');

          for (var i = 0, len = list.length; i < len; i++) {
            this.addItem(list[i]);
          }

          wrapper.append('<button class="add">Add item</button>');
          wrapper.append('<button class="submit">Start!</button>');
        },

        addItem: function (item) {
          this.$list.append('<li><input type="text" value="' + item + '" /><a class="delete">X</a></li>');
        },

        handleFormSubmit: function () {
          var list = [];
          this.$('li input').each(function (i, item) {
            list.push(item.value);
          });
          this.trigger(IndexView.EV_LIST_READY, list);
        },

        handleRemoveItem: function (e) {
          var li = e.currentTarget.parentNode;
          li.parentNode.removeChild(li);
        },

        handleAddItem: function () {
          this.addItem('');
        }
      }, {
        EV_LIST_READY: 'list-ready'
      });

      return IndexView;
    }
);
