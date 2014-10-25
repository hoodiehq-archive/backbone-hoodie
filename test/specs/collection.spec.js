/* jshint expr: true */

'use strict';

describe('Backbone.Collection', function () {

  beforeEach(function () {
    Backbone.connect();

    this.Task = Backbone.Model.extend({
      type: 'task'
    });

    this.Tasks = Backbone.Collection.extend({
      model: this.Task
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

  describe('Backbone.Collection.prototype.create', function() {
    beforeEach(function () {
      this.stub = this.sandbox.stub(Backbone.hoodie.store, 'add', this.promiseMethodStub);

      this.spyOnSuccess = sinon.spy();
      this.spyOnError = sinon.spy();

      this.tasks = new this.Tasks();
      this.tasks.create({ name: 'New Task' }, {
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
        expect(this.tasks.at(0).attributes).to.deep.eql(this.testAttributes);
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

  describe('Backbone.Collection.prototype.fetch', function() {
    beforeEach(function () {
      this.stub = this.sandbox.stub(Backbone.hoodie.store, 'findAll', this.promiseMethodStub);

      this.spyOnSuccess = sinon.spy();
      this.spyOnError = sinon.spy();

      this.tasks = new this.Tasks();
      this.tasks.fetch({
        success: this.spyOnSuccess,
        error: this.spyOnError
      });
    });

    it('delegates to Backbone.hoodie.store.findAll', function () {
      expect(this.stub).to.have.been.calledWith('task');
    });

    describe('success', function () {
      beforeEach(function () {
        this.deferred.resolve([this.testAttributes]);
      });

      it('updates the collection', function () {
        expect(this.tasks.at(0).attributes).to.deep.eql(this.testAttributes);
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

  describe('Backbone.Collection.prototype.fetch with filter', function() {
    beforeEach(function () {
      this.stub = this.sandbox.stub(Backbone.hoodie.store, 'findAll', this.promiseMethodStub);

      this.filter = {
        foo: 'bar'
      };

      this.tasks = new this.Tasks();
      this.tasks.fetch({
        filter: this.filter
      });
    });

    it('delegates to Backbone.hoodie.store.findAll', function () {
      expect(this.stub).to.have.been.calledWith(this.filter);
    });
  });
});
