(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('backbone'), require('underscore'));
  } else {
    root.Backbone.fluxybone = factory(root.Backbone, root._);
  }
}(this, function(Backbone, _) {
FluxyBone = {};
var Dispatcher =  FluxyBone.Dispatcher = function Dispatcher(actions) {

	if(actions) {
		if(typeof actions == 'string') {
			this.createAction(actions);
		}
		else {	
			this.createActions(actions);
		}
	}

	Object.defineProperty(this, '_actions', {
		enumerable: false,
		value: {}
	});

	_.extend(this._actions, Backbone.Events);

};

Dispatcher.prototype = {

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

		var dispatch,
			self = this;

		var emit = function() {
			return function(payload) {
				self._actions.trigger(action.name, payload);
			};
		};

		var beforeEmit = function() {
			return function(payload) {
				action.beforeEmit(payload, function(newPayload) {
					emit(newPayload);
				});
			}
		};

		var shouldEmit = function(fn) {
			return function(payload) {
				if(action.shouldEmit(payload)) {
					fn()(payload);
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
			dispatch = beforeEmit();
		}
		else {
			dispatch = emit();
		}

		Object.defineProperty(this, action.name, {
			enumerable: false,
			value: dispatch
		});

	},

	createActions: function createActions(actions) {
		for(var a in actions) {
			this.createAction(actions[a]);
		}
	},

	register: function register(action, listener, method) {
		method = method || action;

		this._actions.on(action, listener[method].bind(listener));

	}

};
Backbone.FluxyBone = FluxyBone;
return Backbone.fluxybone;
}));
