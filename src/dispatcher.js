var previousDispatcher = root.Dispatcher;

var Dispatcher =  function Dispatcher(options) {

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

Dispatcher.VERSION = '0.0.2';

Dispatcher.noConflict = function noConflict() {
	root.Dispatcher = previousDispatcher;
	return this;
};

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

		var dispatch,
			self = this;

		var emit =  function(payload) {
			self.dispatch(action.name, payload);
		};

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
		for(var a in actions) {
			this.createAction(actions[a]);
		}
	},

	register: function register(action, listener, method) {
		method = method || action;

		this._actions.on(action, listener[method].bind(listener));

	},

	registerStore: function registerStore(actions, listener, methods) {
		methods = methods || actions;

		for(var i = 0; i < actions.length; i++) {
			this.register(actions[i], listener, methods[i]);
		}
	},

	dispatch: function dispatch(actionName, payload) {
		this._actions.trigger(actionName, payload);
	}

};