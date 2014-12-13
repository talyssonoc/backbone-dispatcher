# Backbone Dispatcher

Extension for using [Flux](https://facebook.github.io/flux/docs/overview.html#content) architecture with [Backbone](http://backbonejs.org/)
instead of ReactJS.

```
╔════════════╗       ╔════════════════════╗       ╔═══════╗
║ Dispatcher ║──────>║ Models/Collections ║──────>║ Views ║
╚════════════╝       ╚════════════════════╝       ╚═══════╝
     ^                                                │
     └────────────────────────────────────────────────┘

```

## Usage

```js
	var dispatcher = new Backbone.Dispatcher({
			actions: ['ACTION_1']
		});

	// It can also be a Collection
	var MyBackboneModel = require('./MyBackboneModel');
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

* `extend([options])`: Static method, let's you extend the Dispatcher (check the examples below)
* `createAction(actionName/actionObject[, beforeEmit/actionCallbacks])`: Instance method, creates a new action
* `createActions(arrayOfActions)`: Instance method, receive an array of methods that are passed to `createAction()`
* `dispatch(actionName, payload)`: Instance method, dispatches an action
* `<actionName>(payload)`: Instance method, dispatches the action 'actionName'

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
		var MyCollectionView = require('./MyCollectionView');
		var MyView = require('./MyView');

		var myModel = new MyModel();
		var myCollection = new MyCollection();

		var myView = new MyView({
			model: myModel
		});
		var myCollectionView = new MyView({
			collection: myCollection
		});

		dispatcher.register('action_1', myCollection, 'handleAction1');
		dispatcher.register('action_2', myModel, 'handleAction2');

		dispatcher.dispatch('action_1', 'Yep, that\'s it, I am the payload');
		dispatcher.dispatch('action_2', 3);

```