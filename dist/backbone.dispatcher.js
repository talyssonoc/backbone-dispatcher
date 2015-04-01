(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore'], function(Backbone, _) {
    	return (root.Backbone.Dispatcher = factory(Backbone, _));
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(require('backbone'), require('underscore'));
  } else {
    root.Backbone.Dispatcher = factory(root.Backbone, root._);
  }
}(this, function(Backbone, _) {
'use strict';
var Dispatcher = function Dispatcher(options) {

	if(options && options.actions) {
		if(typeof options.actions === 'string') {
			this.createAction(options.actions);
		}
		else {	
			this.createActions(options.actions);
		}
	}

	Object.defineProperty(this, '_actions', {
		enumerable: false,
		value: {}
	});

	_.extend(this._actions, Backbone.Events);

	this.initialize.apply(this, arguments);
};

Dispatcher.extend = Backbone.Model.extend;

Dispatcher.VERSION = '0.0.6';

Dispatcher.prototype = {

	initialize: function initialize() {},

	_prepareAction: function _prepareAction(name, callbacks) {
		var action = {};

		if(_.isString(name)) {
			action.name = name;

			if(callbacks) {

				if(_.isFunction(callbacks)) {
					action.beforeEmit = callbacks;
				}
				else {
					for(var c in callbacks) {
						if(callbacks.hasOwnProperty(c)) {
							action[c] = callbacks[c];
						}
					}
				}
			}
		} else {
			action = name;
		}

		return action;
	},

	createAction: function createAction(name, callbacks) {
		var action = this._prepareAction(name, callbacks);

		var dispatch;

		var emit =  function(payload) {
			this._triggerAction(action.name, payload);
		}.bind(this);

		var beforeEmit = function(payload) {
			action.beforeEmit(payload, function(newPayload) {
				emit(newPayload);
			});
		};

		var shouldEmit = function(fn) {
			return function(payload) {
				if(action.shouldEmit(payload)) {
					fn(payload);
				}
			};
		};

		if(action.shouldEmit) {

			if(action.beforeEmit) {
				dispatch = shouldEmit(beforeEmit);
			}
			else {
				dispatch = shouldEmit(emit);
			}
		}
		else if(action.beforeEmit) {
			dispatch = beforeEmit;
		}
		else {
			dispatch = emit;
		}

		Object.defineProperty(this, action.name, {
			enumerable: false,
			value: dispatch
		});

	},

	createActions: function createActions(actions) {
		var action;

		for (action in actions) {
			if (actions.hasOwnProperty(action)){
				this.createAction(actions[action]);
			}
		}
	},

	register: function register(action, listener, method) {
		if (!listener){
			throw new Error('The listener is undefined!');
		}

		method = (typeof(method) === 'function') ? method : listener[method || action];

		if (typeof(method) !== 'function') {
			throw new Error('Cannot register callback `' + method +
											'` for the action `' + action +
											'`: the method is undefined on the provided listener object!');
		}

		this._actions.on(action, method.bind(listener));
	},

	registerStore: function registerStore(actions, listener, methods) {
		var isUniqueCallback = typeof(methods)==='string' || typeof(methods)==='function';

		methods = methods || actions;
		for(var i = 0, action; (action = actions[i]); i++) {
			this.register(action, listener, isUniqueCallback ? methods : methods[i]);
		}
	},

	dispatch: function dispatch(actionName, payload) {
		if(this.hasOwnProperty(actionName)) {
			return this[actionName](payload);	
		}

		throw new Error('There is not an action called `' + actionName + '`');
	},

	_triggerAction: function _triggerAction(actionName, payload) {
		this._actions.trigger(actionName, payload);
	}

};
return Dispatcher;
}));
