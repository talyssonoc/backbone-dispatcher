'use strict';

var chai = require('chai');
var expect = chai.expect;

describe('Basics', function() {

  var Dispatcher = require('../../dist/backbone.dispatcher'),
    MyDispatcher,
    myDispatcher;

  beforeEach(function() {
    MyDispatcher = Dispatcher.extend({
      initialize: function initialize() {
        this.attribute = 'value';
      }
    });

    myDispatcher = new MyDispatcher();
  });

  it('should extend the class properly', function() {
    expect(myDispatcher).to.be.instanceOf(MyDispatcher);
    expect(myDispatcher).to.be.instanceOf(Dispatcher);
  });

  describe('#initialize', function() {

    it('should have an instance variable', function() {
      expect(myDispatcher.attribute).to.be.eql('value');
    });

  });

});