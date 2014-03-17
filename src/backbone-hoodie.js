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

    if (! type) {
      type = modelOrCollection.model.prototype.type;
    }

    options.backbone = true;

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
      promise = Backbone.hoodie.store.add(type, attributes, options)
      .done(function (attributes) {
        modelOrCollection.set(attributes);
      });
      break;
    case 'update':
      promise = Backbone.hoodie.store.updateOrAdd(type, id, attributes)
      .done(function (attributes) {
        modelOrCollection.set(attributes);
      });
      break;
    case 'delete':
      promise = Backbone.hoodie.store.remove(type, id);
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

  Backbone.Model.prototype.merge = function (attributes) {
    this.set(attributes, {
      remote: true
    });
  };

  Backbone.Collection.prototype.initialize = function () {
    var type;
    var self = this;
    var store;

    if (! this.model) {
      return;
    }

    type = this.model.type;

    if (type) {

      store = Backbone.hoodie.store(type);
      store.on('add', function (attributes, options) {
        var record;

        // see https://github.com/hoodiehq/backbone-hoodie/issues/3
        if (self.storeBindingFilter && !self.storeBindingFilter(attributes)) {
          return;
        }

        record = self.add(attributes, options);
        self.trigger('create', record, options);
      });

      store.on('remove', function (attributes, options) {
        var record;

        if (self.storeBindingFilter && !self.storeBindingFilter(attributes)) {
          return;
        }

        record = self.get(attributes.id);
        if (record) {
          record.destroy(options);
        }
      });

      store.on('update', function (attributes, options) {
        var record;

        if (self.storeBindingFilter && !self.storeBindingFilter(attributes)) {
          return;
        }

        record = self.get(attributes.id);
        if (options.remote && record) {
          record.merge(attributes);
        }

        self.trigger('update', record, options);
      });
    }
  };

  return Backbone;

}));
