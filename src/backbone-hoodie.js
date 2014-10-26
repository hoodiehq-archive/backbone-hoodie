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

  Backbone.connect = function () {
    if (arguments[0] instanceof Hoodie) {
      Backbone.hoodie = arguments[0];
    } else {
      Backbone.hoodie = new Hoodie(arguments[0]);
    }
  };

  Backbone.sync = function (method, modelOrCollection, options) {
    var attributes, id, promise, type, storeOptions;

    options = options || {};

    if (options.hoodie) {
      return;
    }

    id = modelOrCollection.id;
    attributes = options.attrs || modelOrCollection.toJSON();
    type = modelOrCollection.type;

    if (! type) {
      type = modelOrCollection.model.prototype.type;
    }

    storeOptions = {
      backbone: true
    };

    switch (method) {
    case 'read':
      if (id) {
        promise = Backbone.hoodie.store.find(type, id);
      } else {
        if (options.filter) {
          promise = Backbone.hoodie.store.findAll(options.filter);
        } else {
          promise = Backbone.hoodie.store.findAll(type);
        }
      }
      break;
    case 'create':
      promise = Backbone.hoodie.store.add(type, attributes, storeOptions);
      break;
    case 'update':
      promise = Backbone.hoodie.store.updateOrAdd(type, id, modelOrCollection.changed, storeOptions);
      break;
    case 'delete':
      promise = Backbone.hoodie.store.remove(type, id, storeOptions);
    }

    if (options.success) {
      promise.done(options.success);
    }

    if (options.error) {
      return promise.fail(options.error);
    }

    // allow for chaining
    return promise;
  };

  Backbone.Collection.prototype.initialize = function () {
    var type;
    var self = this;
    var store;

    if (!this.model) {
      return;
    }

    type = this.model.prototype.type;

    if (type) {
      store = Backbone.hoodie.store(type);

      store.on('add', function (attributes, options) {
        if (options.backbone) {
          return;
        }

        self.add(attributes);
      });

      store.on('remove', function (attributes, options) {
        var record;

        if (options.backbone) {
          return;
        }

        record = self.get(attributes.id);
        if (record) {
          record.destroy({
            hoodie: true
          });
        }
      });

      store.on('update', function (attributes, options) {
        var record;

        if (options.backbone) {
          return;
        }

        record = self.get(attributes.id);
        if (record) {
          record.set(attributes);
        }
      });
    }
  };

  return Backbone;

}));
