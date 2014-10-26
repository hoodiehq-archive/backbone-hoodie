/* global Hoodie */
/* jshint expr: true */

'use strict';

describe('Backbone', function() {
  beforeEach(function() {
    this.url = 'http://example.com';
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('Backbone.connect', function() {
    it('defines Backbone.connect', function() {
      expect(Backbone.connect).to.be.an.instanceof(Function);
    });

    it('initializes Hoodie with the given URL', function() {
      Backbone.connect(this.url);
      expect(Backbone.hoodie).to.be.an.instanceof(Hoodie);
      expect(Backbone.hoodie.baseUrl).to.eql(this.url);
    });

    it('initializes with an existing Hoodie instance', function() {
      var hoodie  = new Hoodie(this.url);
      Backbone.connect(hoodie);
      expect(Backbone.hoodie).to.eql(hoodie);
    });
  });

  describe('Backbone.sync', function() {
    beforeEach(function() {
      Backbone.connect(this.url);
      var Task = Backbone.Model.extend({
        type: 'task'
      });
      this.task = new Task({ id: 'juyc3ej' });
    });

    it('accepts options', function() {
      expect(Backbone.sync('create', this.task, { silent: true })).to.be.ok;
    });

    it('does not require options', function() {
      expect(Backbone.sync('create', this.task)).to.be.ok;
    });
  });
});
