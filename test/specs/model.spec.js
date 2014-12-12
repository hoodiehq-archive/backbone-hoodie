/* jshint expr: true */

'use strict';

describe('Backbone.Model', function () {

  beforeEach(function () {
    Backbone.connect("http://example.com");

    this.Task = Backbone.Model.extend({
      type: 'task'
    });

    // a fresh task
    this.newTaskAttributes = {
      name: 'New Task'
    };

    // a persisted task
    this.taskAttributes = _.extend({}, this.newTaskAttributes, {
      id: 'juyc3ej',
      type: 'todo',
      createdBy: 'pe3vv6m',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // a changeset for a task
    this.changedTaskAttributes = {
      name: 'Updated Name',
      tags: 'foo, bar, baz'
    }

    // a changed task that has been persisted
    this.updatedTaskAttributes = _.extend({}, this.taskAttributes, this.changedTaskAttributes, {
      updatedAt: new Date()
    });

    this.sandbox = sinon.sandbox.create();

    var deferred = jQuery.Deferred();
    this.deferred = deferred;
    this.promiseMethodStub = function () {
      return deferred.promise();
    };
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  describe('Backbone.Model.prototype.save', function() {
    describe('for a new model', function() {
      beforeEach(function () {
        this.stub = this.sandbox.stub(Backbone.hoodie.store, 'add', this.promiseMethodStub);

        this.spyOnSuccess = sinon.spy();
        this.spyOnError = sinon.spy();

        this.task = new this.Task(this.newTaskAttributes);

        this.task.save({}, {
          success: this.spyOnSuccess,
          error: this.spyOnError
        });
      });

      it('delegates to Backbone.hoodie.store.add', function () {
        expect(this.stub).to.have.been.calledWith('task', this.newTaskAttributes, { backbone: true });
      });

      describe('success', function () {
        beforeEach(function () {
          this.deferred.resolve(this.taskAttributes);
        });

        it('updates the attributes', function () {
          expect(this.task.attributes).to.deep.eql(this.taskAttributes);
        });

        it('calls the success callback', function () {
          expect(this.spyOnSuccess).to.have.been.called;
        });
      });

      describe('failure', function () {
        beforeEach(function () {
          this.deferred.reject({});
        });

        it('calls the error callback', function () {
          expect(this.spyOnError).to.have.been.called;
        });
      });
    });

    describe('for an existing model', function() {
      beforeEach(function () {
        this.stub = this.sandbox.stub(Backbone.hoodie.store, 'updateOrAdd', this.promiseMethodStub);

        this.spyOnSuccess = sinon.spy();
        this.spyOnError = sinon.spy();

        this.task = new this.Task(this.taskAttributes);

        this.task.save(this.changedTaskAttributes, {
          success: this.spyOnSuccess,
          error: this.spyOnError
        });
      });

      it('delegates to Backbone.hoodie.store.updateOrAdd with the changed attributes', function () {
        expect(this.stub).to.have.been.calledWith('task', this.task.id, this.changedTaskAttributes, { backbone: true });
      });

      describe('success', function () {
        beforeEach(function () {
          this.deferred.resolve(this.updatedTaskAttributes);
        });

        it('updates the attributes', function () {
          expect(this.task.attributes).to.deep.eql(this.updatedTaskAttributes);
        });

        it('calls the success callback', function () {
          expect(this.spyOnSuccess).to.have.been.called;
        });
      });

      describe('failure', function () {
        beforeEach(function () {
          this.deferred.reject();
        });

        it('calls the error callback', function () {
          expect(this.spyOnError).to.have.been.called;
        });
      });
    });
  });

  describe('Backbone.Model.prototype.fetch', function() {
    beforeEach(function () {
      this.stub = this.sandbox.stub(Backbone.hoodie.store, 'find', this.promiseMethodStub);

      this.spyOnSuccess = sinon.spy();
      this.spyOnError = sinon.spy();

      this.task = new this.Task({ id: this.taskAttributes.id } );
      this.task.fetch({
        success: this.spyOnSuccess,
        error: this.spyOnError
      });
    });

    it('delegates to Backbone.hoodie.store.find', function () {
      expect(this.stub).to.have.been.calledWith('task', this.taskAttributes.id);
    });

    describe('success', function () {
      beforeEach(function () {
        this.deferred.resolve(this.taskAttributes);
      });

      it('updates the attributes', function () {
        expect(this.task.attributes).to.deep.eql(this.taskAttributes);
      });

      it('calls the success callback', function () {
        expect(this.spyOnSuccess).to.have.been.called;
      });
    });

    describe('failure', function () {
      beforeEach(function () {
        this.deferred.reject();
      });

      it('calls the error callback', function () {
        expect(this.spyOnError).to.have.been.called;
      });
    });
  });

  describe('Backbone.Model.prototype.destroy', function() {
    beforeEach(function () {
      this.stub = this.sandbox.stub(Backbone.hoodie.store, 'remove', this.promiseMethodStub);

      this.spyOnSuccess = sinon.spy();
      this.spyOnError = sinon.spy();

      this.task = new this.Task(this.taskAttributes);
      this.task.save();

      this.task.destroy({
        success: this.spyOnSuccess,
        error: this.spyOnError
      });
    });

    it('delegates to Backbone.hoodie.store.remove', function () {
      expect(this.stub).to.have.been.calledWith('task', this.taskAttributes.id, { backbone: true });
    });

    describe('success', function () {
      beforeEach(function () {
        this.deferred.resolve();
      });

      it('calls the success callback', function () {
        expect(this.spyOnSuccess).to.have.been.called;
      });
    });

    describe('failure', function () {
      beforeEach(function () {
        this.deferred.reject();
      });

      it('calls the error callback', function () {
        expect(this.spyOnError).to.have.been.called;
      });
    });
  });
});
