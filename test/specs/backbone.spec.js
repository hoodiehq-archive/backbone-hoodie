/* global Hoodie */
/* jshint expr: true */

'use strict';

describe('Backbone', function() {
  beforeEach(function () {
    this.url = 'http://example.com';
  });

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
