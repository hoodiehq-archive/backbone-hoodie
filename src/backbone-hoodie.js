(function (root, factory) {

  'use strict';

  if (typeof exports === 'object') {

    var backbone = require('backbone');
    var hoodie = require('hoodie');

    module.exports = factory(backbone, hoodie);

  } else if (typeof define === 'function' && define.amd) {

    define(['backbone', 'hoodie'], factory);

  } else {
    // Browser globals
    root.Backbone.hoodie = factory(root.Backbone, root.Hoodie);
  }

}(this, function (Backbone, Hoodie) {

  'use strict';

  Backbone.connect = function (url) {
    Backbone.hoodie = new Hoodie(url);
  };

  Backbone.sync = function (method, modelOrCollection, options) {
    var attributes, id, promise, type;

    id = modelOrCollection.id;
    attributes = modelOrCollection.attributes;
    type = modelOrCollection.type;

    type = type || (type = modelOrCollection.model.prototype.type);

    promise = (function () {
      switch (method) {
        case 'read':
          if (id) {
            return Backbone.hoodie.store.find(type, id);
          } else {
            return Backbone.hoodie.store.findAll(type);
          }
          break;
        case 'create':
          return Backbone.hoodie.store.add(type, attributes);
        case 'update':
          return Backbone.hoodie.store.update(type, id, attributes);
        case 'delete':
          return Backbone.hoodie.store.remove(type, id);
      }
    })();

    if (options.success) {
      promise.done(options.success);
    }

    if (options.error) {
      return promise.fail(options.error);
    }

  };

  Backbone.Model.prototype.merge = function (attributes) {
    this.set(attributes, {
      remote: true
    });
  };

  Backbone.Collection.prototype.initialize = function () {
    var type;
    var self = this;

    if (this.model) {
      type = this.model.prototype.type;

      this.fetch();

      if (type) {

        Backbone.hoodie.store.on('add:' + type, function (attributes) {
          self.eventAdd(attributes);
        });

        Backbone.hoodie.remote.on('add:' + type, function (attributes) {
          self.eventAdd(attributes);
        });

        Backbone.hoodie.store.on('remove:' + type, function (attributes) {
          self.eventRemove(attributes);
        });

        Backbone.hoodie.remote.on('remove:' + type, function (attributes) {
          self.eventRemove(attributes);
        });

        Backbone.hoodie.store.on('update:' + type, function (attributes) {
          self.eventUpdate(attributes);
        });

        Backbone.hoodie.remote.on('update:' + type, function (attributes) {
          self.eventUpdate(attributes);
        });

      }

    }

  };

  Backbone.Collection.prototype.eventAdd = function (attributes) {
    this.add(attributes);
  };

  Backbone.Collection.prototype.eventRemove = function (attributes) {
    var id, _ref;
    id = attributes.id;

    return (_ref = this.get(id)) !== null ? _ref.destroy() : void 0;
  };

  Backbone.Collection.prototype.eventUpdate = function (attributes) {
    var id, _ref;
    id = attributes.id;
    return (_ref = this.get(id)) !== null ? _ref.merge(attributes) : void 0;
  };

  return Backbone;

}));

