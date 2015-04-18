# Backbone Dispatcher

[![Build Status](https://travis-ci.org/talyssonoc/backbone-dispatcher.svg?branch=master)](https://travis-ci.org/talyssonoc/backbone-dispatcher) 
[![Code Climate](https://codeclimate.com/github/talyssonoc/backbone-dispatcher/badges/gpa.svg)](https://codeclimate.com/github/talyssonoc/backbone-dispatcher) 

Extension for using [Flux](https://facebook.github.io/flux/docs/overview.html#content) architecture with [Backbone](http://backbonejs.org/)
instead of ReactJS.

```
╔════════════╗       ╔════════════════════╗       ╔═══════╗
║ Dispatcher ║──────>║ Models/Collections ║──────>║ Views ║
╚════════════╝       ╚════════════════════╝       ╚═══════╝
     ^                                                │
     └────────────────────────────────────────────────┘

```

## Installing

Via npm

```sh
	npm install backbone-dispatcher --save
```

or via Bower

```sh
	bower install backbone-dispatcher --save
```

## Usage

```js
	var dispatcher = new Backbone.Dispatcher({
			actions: ['ACTION_1']
		});

	// It can also be a Collection
	var MyModel = require('./MyModel');
	var myModel = new MyModel();

	// When ACTION_1 is dispatched, pass the payload for myModel.methodName()
	// If doesn't pass the third argument, it will call myModel.ACTION_1()
	dispatcher.register('ACTION_1', myModel, 'methodName');

	// You can dispatch like this
	dispatcher.ACTION_1('Hi, I\'m the payload');
	dispatcher.dispatch('ACTION_1', 'Hello!');

	// Now you can make your views listen to your store (Model or Collection)

```

## API

* `extend([options])`: Static method, let's you extend the Dispatcher (check the examples below).
* `createAction(actionName/actionObject[, beforeEmit/actionCallbacks])`: Instance method, creates a new action. Callbacks:
	* `shouldEmit(payload)`: Returns true if should emit, and false if not.
	* `beforeEmit(payload, next)`: Run right after `shouldEmit`, pass the changed payload as parameter to next.
* `createActions(arrayOfActions)`: Instance method, receive an array of methods that are passed to `createAction()`.
* `dispatch(actionName, payload)`: Instance method, dispatches an action.
* `<actionName>(payload)`: Instance method, dispatches the action 'actionName'.
* `register(actionName, model/collection[, callback])`: Makes the model/collections listen to `actionName`, and will call either `callback(payload)` (if callback is a function), or `model[callback](payload)`/`collection[callback](payload)` (if callback is a string corresponding to a model/collection's method name) when dispatched. If `callback` is not passed, it will be the same as `actionName` (so a `model[actionName](payload)` would be executed).
* `registerStore(actionNamesArray, model/collection[, callbacks])`: Calls `register` (see the line above) for each pair action/callback. `callbacks` can also be a string or a function: in this case, all the actions will be bound to such unique callback.

## Examples

```js

	var MyDispatcher = Backbone.Dispatcher.extend({
			initialize: function() {
				console.log('I\'m the constructor here!');
			}
		});

	// You can create actions in the constructor
	var dispatcher = new MyDispatcher({
			actions: [
				'action_1',
				{
					name: 'action_2',
					beforeEmit: function(payload, next) {
						console.log('Hey, I\'m emiting ' + payload + '!');
						next(payload);
					},
					shouldEmit: function(payload) {
						if(payload < 2) {
							console.log('Sorry, son, I can\'t emit ' + payload);
							return false;
						}
						console.log('Aaw yeah, just emiting ' + payload + '!');
						return true;
					}
				}
			]
		});

		// Or like this
		dispatcher.createAction('action_3');

		// Or like this
		dispatcher.createAction('action_4', function(payload, next) {
			console.log('So... this is the beforeEmit!, I\'m gonna double it for you.');
			next(payload * 2);
		});

		// Or like this
		dispatcher.createAction('action_5', {
			beforeEmit: function(payload, next) {
				console.log('Hey!');
				next(payload);
			},
			shouldEmit: function(payload) {
				console.log('I would say that you shall not pass, but c\'mon...');
				return true;
			}
		});

		// Or like this
		dispatcher.createActions([
			'action_6',
			'action_7'
		]);

		var MyCollection = require('./MyCollection');
		var MyModel = require('./MyModel');

		var myModel = new MyModel();
		var myCollection = new MyCollection();


		dispatcher.register('action_1', myCollection, 'handleAction1');
		dispatcher.registerStore(['action_2'], myModel, ['handleAction2']);
		dispatcher.register('action_2', myCollection, function shinyCallback() {
    			console.log('Hi. This is action_2\'s inline callback! I am bound to myCollection so I can also output things like ' + this.toJSON());
    		});
		dispatcher.registerStore({ action_3: 'handleAction3' }, myModel);

		dispatcher.dispatch('action_1', 'Yep, that\'s it, I am the payload');
		dispatcher.dispatch('action_2', 3);

```
