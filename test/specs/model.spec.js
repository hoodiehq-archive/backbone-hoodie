/* jshint expr: true */

'use strict';

describe('Backbone.Model', function () {

  beforeEach(function () {
    Backbone.connect("http://example.com");

    this.Task = Backbone.Model.extend({
      type: 'task'
    });

    this.testAttributes = {
      id: 'juyc3ej',
      name: 'New Task'
    };

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

  describe('Backbone.Model.prototype.merge', function() {
    it('defines Backbone.Model.prototype.merge', function() {
      expect(Backbone.Model.prototype.merge).to.be.an.instanceof(Function);
    });

    it('calls Backbone.Model.prototype.set with the given attributes and the remote option', function() {
      var task = new this.Task(this.testAttributes);
      var spy = this.sandbox.spy(task, 'set');

      task.merge({
        name: 'Updated Name',
        tags: 'foo, bar, baz'
      });

      expect(spy).to.have.been.calledWith({
        name: 'Updated Name',
        tags: 'foo, bar, baz'
      }, {
        remote: true
      });
    });
  });

  describe('Backbone.Model.prototype.save', function() {
    describe('for a new model', function() {
      beforeEach(function () {
        this.stub = this.sandbox.stub(Backbone.hoodie.store, 'add', this.promiseMethodStub);

        this.spyOnSuccess = sinon.spy();
        this.spyOnError = sinon.spy();

        this.task = new this.Task({ name: 'New Task' });

        this.task.save({}, {
          success: this.spyOnSuccess,
          error: this.spyOnError
        });
      });

      it('delegates to Backbone.hoodie.store.add', function () {
        expect(this.stub).to.have.been.calledWith('task', { name: 'New Task' });
      });

      describe('success', function () {
        beforeEach(function () {
          this.deferred.resolve(this.testAttributes);
        });

        it('updates the attributes', function () {
          expect(this.task.attributes).to.deep.eql(this.testAttributes);
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

        this.task = new this.Task(this.testAttributes);

        this.task.save({
          name: 'Updated Name'
        }, {
          success: this.spyOnSuccess,
          error: this.spyOnError
        });
      });

      it('delegates to Backbone.hoodie.store.updateOrAdd with the changed attributes', function () {
        expect(this.stub).to.have.been.calledWith('task', this.task.id, { name: 'Updated Name' });
      });

      describe('success', function () {
        beforeEach(function () {
          this.updatedTestAttributes = this.testAttributes;
          this.updatedTestAttributes.name = 'Updated Name';
          this.deferred.resolve(this.updatedTestAttributes);
        });

        it('updates the attributes', function () {
          expect(this.task.attributes).to.deep.eql(this.updatedTestAttributes);
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

      this.task = new this.Task({ id: this.testAttributes.id } );
      this.task.fetch({
        success: this.spyOnSuccess,
        error: this.spyOnError
      });
    });

    it('delegates to Backbone.hoodie.store.find', function () {
      expect(this.stub).to.have.been.calledWith('task', this.task.id);
    });

    describe('success', function () {
      beforeEach(function () {
        this.deferred.resolve(this.testAttributes);
      });

      it('updates the attributes', function () {
        expect(this.task.attributes).to.deep.eql(this.testAttributes);
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

      this.task = new this.Task(this.testAttributes);
      this.task.save();

      this.task.destroy({
        success: this.spyOnSuccess,
        error: this.spyOnError
      });
    });

    it('delegates to Backbone.hoodie.store.remove', function () {
      expect(this.stub).to.have.been.calledWith('task', this.task.id);
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
