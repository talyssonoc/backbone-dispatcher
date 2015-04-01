'use strict';

var chai = require('chai');
var expect = chai.expect;

describe('Action creation', function() {

  var Dispatcher = require('../../dist/backbone.dispatcher');
  var MyDispatcher = Dispatcher.extend({});
  var myDispatcher;

  it('should create actions in the instantiation', function() {
    myDispatcher = new MyDispatcher({
      actions: [
        'action_1',
        {
          name: 'action_2'
        },
        {
          name: 'action_3',
          beforeEmit: function() {},
          shouldEmit: function() {}
        }
      ]
    });

    expect(myDispatcher.action_1).to.be.a('function');
    expect(myDispatcher.action_2).to.be.a('function');
    expect(myDispatcher.action_3).to.be.a('function');
  });

  describe('#createAction', function() {

    beforeEach(function() {
      myDispatcher = new MyDispatcher();
    });

    it('should create actions without callbacks', function() {
      myDispatcher.createAction('action_1');
      myDispatcher.createAction('action_2');

      expect(myDispatcher.action_1).to.be.a('function');
      expect(myDispatcher.action_2).to.be.a('function');
    });

    it('should create actions with callbacks', function() {
      myDispatcher.createAction('action_1', function() {});
      myDispatcher.createAction('action_2', {
        beforeEmit: function() {},
        shouldEmit: function() {}
      });

      expect(myDispatcher.action_1).to.be.a('function');
      expect(myDispatcher.action_2).to.be.a('function');
    });

  });

  describe('#createActions', function() {

    beforeEach(function() {
      myDispatcher = new MyDispatcher();
    });

    it('should create actions without callbacks', function() {
      myDispatcher.createActions(['action_1', 'action_2']);

      expect(myDispatcher.action_1).to.be.a('function');
      expect(myDispatcher.action_2).to.be.a('function');
    });

    it('should create actions with callbacks', function() {
      myDispatcher.createActions([
        'action_1',
        {
          name: 'action_2'
        },
        {
          name: 'action_3',
          beforeEmit: function() {},
          shouldEmit: function() {}
        }
      ]);

      expect(myDispatcher.action_1).to.be.a('function');
      expect(myDispatcher.action_2).to.be.a('function');
      expect(myDispatcher.action_3).to.be.a('function');

    });

  });

});