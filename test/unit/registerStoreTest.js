'use strict';

var chai = require('chai');
var expect = chai.expect;

describe('#registerStore', function() {

  var Dispatcher = require('../../dist/backbone.dispatcher');
  var MyDispatcher = Dispatcher.extend({});
  var myDispatcher;
  var Model = require('backbone').Model;
  var MyModel;
  var myModel;

  it('should trigger a handler passing a single array of events', function(done) {

    MyModel = Model.extend({
      action_1: function(options) {
        expect(options.payload).to.be.equal('value');
        options.done();
      }
    });

    myModel = new MyModel();
    myDispatcher = new MyDispatcher();
    myDispatcher.createAction('action_1');

    myDispatcher.registerStore(['action_1'], myModel);
    myDispatcher.dispatch('action_1', {
      payload: 'value',
      done: done
    });
  });

  it('should trigger a handler passing the array of events and handlers names', function(done) {

    MyModel = Model.extend({
      actionHandler: function(options) {
        expect(options.payload).to.be.equal('value 2');
        options.done();
      }
    });

    myModel = new MyModel();
    myDispatcher = new MyDispatcher();
    myDispatcher.createAction('action_1');

    myDispatcher.registerStore(['action_1'], myModel, ['actionHandler']);
    myDispatcher.dispatch('action_1', {
      payload: 'value 2',
      done: done
    });
  });

  it('should trigger a handler passing an object of events and handlers names', function(done) {

    MyModel = Model.extend({
      actionHandler: function(options) {
        expect(options.payload).to.be.equal('value 2');
        options.done();
      }
    });

    myModel = new MyModel();
    myDispatcher = new MyDispatcher();
    myDispatcher.createAction('action_1');

    myDispatcher.registerStore({
      'action_1': 'actionHandler'
    }, myModel);

    myDispatcher.dispatch('action_1', {
      payload: 'value 2',
      done: done
    });
  });

  it('should trigger a handler passing an object of events and handlers', function(done) {

    MyModel = Model.extend({});
    myModel = new MyModel();

    myDispatcher = new MyDispatcher();
    myDispatcher.createAction('action_1');

    myDispatcher.registerStore(['action_1'], myModel, function(options) {
      expect(options.payload).to.be.equal(2);
      options.done();
    });

    myDispatcher.dispatch('action_1', {
      payload: 2,
      done: done
    });
  });

  it('should throw an error if the number of events and handlers differ', function(){

    MyModel = Model.extend({});
    myModel = new MyModel();

    myDispatcher = new MyDispatcher();
    myDispatcher.createAction('action_1');
    myDispatcher.createAction('action_2');
    myDispatcher.createAction('action_3');

    var fn = function() {
      myDispatcher.registerStore(['action_1', 'action_2', 'action_3'], myModel, ['actionHandler1', 'acitonHandler2']);
    };
    expect(fn).to.throw(RangeError);
  });
});
