'use strict';

var chai = require('chai');
var expect = chai.expect;

describe('#register', function() {

  var Dispatcher = require('../../dist/backbone.dispatcher');
  var MyDispatcher = Dispatcher.extend({});
  var myDispatcher;
  var Model = require('backbone').Model;
  var MyModel;
  var myModel;

  it('should trigger a handler with the same name without callbacks', function(done) {

    MyModel = Model.extend({
      action_1: function(options) {
        expect(options.payload).to.be.equal('value');
        options.done();
      }
    });

    myModel = new MyModel();
    myDispatcher = new MyDispatcher();
    myDispatcher.createAction('action_1');

    myDispatcher.register('action_1', myModel);
    myDispatcher.dispatch('action_1', {
      payload: 'value',
      done: done
    });
  });

  it('should trigger a handler with custom name without callbacks', function(done) {

    MyModel = Model.extend({
      actionHandler: function(options) {
        expect(options.payload).to.be.equal('value 2');
        options.done();
      }
    });

    myModel = new MyModel();
    myDispatcher = new MyDispatcher();
    myDispatcher.createAction('action_1');

    myDispatcher.register('action_1', myModel, 'actionHandler');
    myDispatcher.dispatch('action_1', {
      payload: 'value 2',
      done: done
    });
  });

  it('should trigger a handler with beforeEmit callback', function(done) {

    MyModel = Model.extend({
      actionHandler: function(options) {
        expect(options.payload).to.be.equal(4);
        options.done();
      }
    });

    myModel = new MyModel();
    myDispatcher = new MyDispatcher();
    myDispatcher.createAction('action_1', function(options, next) {
      next({
        payload: options.payload * 2,
        done: options.done
      });
    });

    myDispatcher.register('action_1', myModel, 'actionHandler');
    myDispatcher.dispatch('action_1', {
      payload: 2,
      done: done
    });
  });

  it('should trigger a handler with beforeEmit and shouldEmit callbacks', function(done) {

    MyModel = Model.extend({
      actionHandler: function(options) {
        expect(options.payload).to.be.equal(6);
        options.done();
      }
    });

    var myModel = new MyModel();
    myDispatcher = new MyDispatcher();
    myDispatcher.createAction('action_1', {
      beforeEmit: function(options, next) {
        next({
          payload: options.payload * 2,
          done: options.done
        });
      },
      shouldEmit: function(options) {
        return options.payload > 0;
      }
    });

    myDispatcher.register('action_1', myModel, 'actionHandler');
    myDispatcher.action_1({
      payload: 3,
      done: done
    });
  });

  it('should not trigger a handler because of shouldEmit', function() {

    var flag = false;

    MyModel = Model.extend({
      actionHandler: function() {
        flag = true;
      }
    });

    var myModel = new MyModel();
    myDispatcher = new MyDispatcher();
    myDispatcher.createAction('action_1', {
      beforeEmit: function(payload, next) {
        next(payload);
      },
      shouldEmit: function(payload) {
        return payload > 3;
      }
    });

    myDispatcher.register('action_1', myModel, 'actionHandler');
    myDispatcher.dispatch('action_1', 3);

    expect(flag).to.be.equal(false);
  });
});