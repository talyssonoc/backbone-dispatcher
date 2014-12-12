var Dispatcher =  FluxyBone.Dispatcher = function Dispatcher(actions) {

	if(!actions) {
		return this;
	}

	if(typeof actions == 'string') {
		this.createAction(actions);
	}
	else {	
		this.createActions(actions);
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

		var emit = function(payload) {
			return function() {
				self._actions.trigger(action.name, payload);
			}
		};

		var beforeEmit = function(payload) {
			return function() {
				action.beforeEmit(payload, function(newPayload) {
					emit(newPayload);
				});
			}
		};

		var shouldEmit = function(payload, fn) {
			return function() {
				if(action.shouldEmit(payload)) {
					fn(payload)();
				}
			}
		};

		if(action.shouldEmit) {
			if(action.beforeEmit) {
				dispatch = shouldEmit(payload, beforeEmit);
			}
			else {
				dispatch = shouldEmit(payload, emit);
			}
		}
		else if(action.beforeEmit) {
			dispatch = beforeEmit(payload);
		}
		else {
			dispatch = emit(payload);
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
	}

};