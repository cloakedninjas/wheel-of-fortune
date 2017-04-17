'use strict';

require(['indexView', 'wheelView'], function (IndexView, WheelView) {
  var indexView = new IndexView();

  indexView.on(IndexView.EV_LIST_READY, function (data) {
    indexView.remove();
    new WheelView(data);
  });
});