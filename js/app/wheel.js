'use strict';

define(['jquery', 'underscore', 'backbone', 'text!templates/wheel.html'], function ($, _, Backbone, templateHTML) {
  var WheelView = Backbone.View.extend({

    template: _.template(templateHTML),

    items: null,
    numOfSegments: 0,
    canvas: null,
    ctx: null,
    centre: {
      x: 0,
      y: 0
    },
    arcSize: 0,
    rotation: 0,
    wheelRadius: 0,
    generatedWheel: null,
    velocity: 0,

    initialize: function (items) {
      this.items = items;
      this.numOfSegments = items.length;

      this.render();

      this.canvas = document.getElementById('wheel');
      this.ctx = this.canvas.getContext('2d');

      this.arcSize = WheelView.PI_2 / this.numOfSegments;

      this.canvas.width = window.innerWidth * window.devicePixelRatio;
      this.canvas.height = window.innerHeight * window.devicePixelRatio;

      this.centre.x = this.canvas.width / 2;
      this.centre.y = this.canvas.height / 2;

      this.wheelRadius = Math.min(this.centre.x, this.centre.y) - 50;

      if (window.devicePixelRatio > 1) {
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
      }

      this.shuffle(this.items);
      this.generateWheel();

      this.canvas.addEventListener('click', this.spin.bind(this));

      this.animate();
    },

    ROTATION_SPEED: 0.05,

    spin: function () {
      this.velocity = 100;
    },

    render: function () {
      this.$el.html(this.template);
      document.getElementById('main').appendChild(this.el);
      return this;
    },

    animate: function () {
      this.ctx.save();

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.translate(this.centre.x, this.centre.y);
      this.ctx.rotate(this.rotation);
      this.ctx.translate(-this.wheelRadius, -this.wheelRadius);
      this.ctx.drawImage(this.generatedWheel, 0, 0);

      if (this.velocity > 0) {
        this.rotation += (this.velocity * this.ROTATION_SPEED) / 100;
        this.rotation = this.rotation % WheelView.PI_2;
        this.velocity -= 0.25;
      }

      this.ctx.restore();

      // draw line

      this.ctx.beginPath();
      this.ctx.moveTo(this.centre.x + this.wheelRadius - 5, this.centre.y);
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 3;
      this.ctx.lineTo(this.centre.x + this.wheelRadius + 50, this.centre.y);
      this.ctx.stroke();

      // draw num
      this.ctx.fillStyle = "#000";
      this.ctx.font = '32px Arial';
      this.ctx.fillText(this.getNumberFromRotation(), 20, 40);

      window.requestAnimationFrame(this.animate.bind(this));
    },

    generateWheel: function () {
      var canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d'),
          arcProgression = 0,
          cX = this.wheelRadius,
          cY = this.wheelRadius;

      canvas.width = this.wheelRadius * 2;
      canvas.height = this.wheelRadius * 2;

      for (var i = 0; i < this.numOfSegments; i++) {
        var arcEnd = arcProgression + this.arcSize;

        // draw segments
        ctx.fillStyle = this.getSegmentColour(i);
        ctx.beginPath();
        ctx.moveTo(cX, cY);
        ctx.arc(cX, cY, this.wheelRadius, arcProgression, arcEnd);
        ctx.lineTo(cX, cY);
        ctx.fill();

        // draw labels
        ctx.save();
        var adjacent = Math.cos(arcProgression + (arcEnd - arcProgression) / 2) * (this.wheelRadius - 10);
        var opposite = Math.sin(arcProgression + (arcEnd - arcProgression) / 2) * (this.wheelRadius - 10);
        ctx.translate(cX + adjacent, cY + opposite);
        ctx.rotate(arcProgression + (arcEnd - arcProgression) / 2);

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.font = '16px Arial';
        ctx.fillText(this.items[i], 0, 0);

        ctx.restore();

        arcProgression += this.arcSize;
      }

      this.generatedWheel = canvas;
    },

    getSegmentColour: function (i) {
      var mod = i % 5;

      switch (mod) {
        case 0:
          return '#29c0d1';

        case 1:
          return '#FE5A8C';

        case 2:
          return '#FFAB15';

        case 3:
          return '#267A76';

        case 4:
          return '#96476F';

        case 5:
          return '#CE4400';
      }
    },

    getNumberFromRotation: function () {
      var i = Math.floor(this.rotation / this.arcSize);
      return this.items[this.numOfSegments - 1 - i];
    },

    /**
     * @link http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
     */
    shuffle: function (array) {
      var counter = array.length;

      // While there are elements in the array
      while (counter > 0) {
        // Pick a random index
        var index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        var temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
      }

      return array;
    }

  }, {
    PI_2: Math.PI * 2
  });

  return WheelView;

});