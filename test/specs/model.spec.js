/* jshint expr: true */

'use strict';

describe('Backbone.Model', function () {

  beforeEach(function () {
    Backbone.connect();

    this.Task = Backbone.Model.extend({
      type: 'task',
      defaults: {
        name: 'New Task'
      }
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

  describe('Backbone.Model.prototype.merge', function() {
    it('defines Backbone.Model.prototype.merge', function() {
      expect(Backbone.Model.prototype.merge).to.be.an.instanceof(Function);
    });

    it('calls Backbone.Model.prototype.set with the given attributes and the remote option', function() {
      var task = new this.Task({ foo: 'something' });
      var spy = this.sandbox.spy(task, 'set');
      task.merge({ bar: 'something else'});
      expect(spy).to.have.been.calledWith({ bar: 'something else' }, { remote: true });
    });
  });

  describe('Backbone.Model.prototype.save', function() {
    describe('for a new model', function() {
      beforeEach(function () {
        this.stub = this.sandbox.stub(Backbone.hoodie.store, 'add', this.promiseMethodStub);

        this.spyOnSuccess = sinon.spy();
        this.spyOnError = sinon.spy();

        this.task = new this.Task({});

        this.task.save();

        this.task.save({}, { success: this.spyOnSuccess, error: this.spyOnError });
      });

      it('delegates to Backbone.hoodie.store.add', function () {
        expect(this.stub).to.have.been.calledWith('task', { name: 'New Task' });
      });

      describe('success', function () {
        beforeEach(function () {
          this.deferred.resolve({ id: 'juyc3ej' });
        });

        it('updates the attributes', function () {
          expect(this.task.attributes).to.deep.eql({ id: 'juyc3ej', name: 'New Task' });
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

        this.task = new this.Task({ id: 'i61zz3i' });

        this.task.save({ foo: 'something' }, { success: this.spyOnSuccess, error: this.spyOnError });
      });

      it('delegates to Backbone.hoodie.store.updateOrAdd with the changed attributes', function () {
        expect(this.stub).to.have.been.calledWith('task', this.task.id, { foo: 'something' });
      });

      describe('success', function () {
        beforeEach(function () {
          this.deferred.resolve({ updatedAt: '2014-10-24T00:04:50.454Z' });
        });

        it('updates the attributes', function () {
          expect(this.task.attributes).to.deep.eql({
            id: 'i61zz3i',
            updatedAt: '2014-10-24T00:04:50.454Z',
            name: 'New Task',
            foo: 'something',
          });
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

      this.task = new this.Task({});
      this.task.save();

      this.task.fetch({ success: this.spyOnSuccess, error: this.spyOnError });
    });

    it('delegates to Backbone.hoodie.store.find', function () {
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

  describe('Backbone.Model.prototype.destroy', function() {
    beforeEach(function () {
      this.stub = this.sandbox.stub(Backbone.hoodie.store, 'remove', this.promiseMethodStub);

      this.spyOnSuccess = sinon.spy();
      this.spyOnError = sinon.spy();

      this.task = new this.Task({});
      this.task.save();

      this.task.destroy({ success: this.spyOnSuccess, error: this.spyOnError });
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
