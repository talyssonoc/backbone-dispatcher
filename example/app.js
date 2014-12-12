$(function() {
	var TodoAppBackboneReflux = Backbone.View.extend({

		events: {
			'click .add': 'create'
		},

		initialize: function() {
			this.store = new TodoCollection();

			this.dispatcher = new Backbone.FluxyBone.Dispatcher();

			this.dispatcher.createActions([
				'create',
				'toggle',
				'remove'
			]);

			this.dispatcher.register('create', this.store, 'createTodo');
			this.dispatcher.register('toggle', this.store, 'toggleTodo');
			this.dispatcher.register('remove', this.store, 'removeTodo');

			this.listenTo(this.store, 'change', this.render);
		},

		create: function create() {
			this.dispatcher.create(prompt('Title'));
		},

		render: function() {

			var todosElement = this.$el.find('.todos');

			todosElement.empty();

			this.store.forEach(function(todo) {
				var todoView = new TodoView({
					model: todo
				});

				todosElement.append(todoView.render());
			});
		}
	});

	var TodoView = Backbone.View.extend({
		tagName: 'li',

		template: _.template('<input type=\'checkbox\' <% if(complete) { print(\'checked="checked"\'); } %>/><span><%= title %></span> <span class="remove">x</span>'),

		events: {
			'click input': 'toggle',
			'click .remove': 'remove'
		},

		initialize: function() {
			this.listenTo(this.model, 'change', this.render.bind(this));
		},

		toggle: function() {
			backboneAppReflux.dispatcher.toggle(this.model);
		},

		remove: function() {
			backboneAppReflux.dispatcher.remove(this.model)
		},

		render: function () {
			this.$el.html(this.template(this.model.attributes));

			return this.$el;
		}
	});

	var backboneAppReflux = new TodoAppBackboneReflux({
		el: document.getElementById('app')
	});

	backboneAppReflux.render();
});
