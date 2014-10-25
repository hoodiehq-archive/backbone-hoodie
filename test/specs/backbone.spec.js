/* jshint expr: true */

'use strict';

describe('Backbone', function() {
  it('defines Backbone.connect', function() {
    expect(Backbone.connect).to.be.an.instanceof(Function);
  });

  it('initializes Hoodie with the given URL', function() {
    var url = 'http://example.com';
    Backbone.connect(url);
    expect(Backbone.hoodie.baseUrl).to.eql(url);
  });
});
