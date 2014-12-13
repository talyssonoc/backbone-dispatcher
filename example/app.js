$(function() {
	var TodoAppBackbone = Backbone.View.extend({

		events: {
			'click #add': 'create'
		},

		initialize: function() {
			this.store = new TodoCollection();

			var TodoDispatcher = Backbone.Dispatcher.extend({});

			this.dispatcher = new TodoDispatcher({
				actions: [
					'create',
					'toggle',
					'remove'
				]
			});

			this.dispatcher.register('create', this.store, 'createTodo');
			this.dispatcher.register('toggle', this.store, 'toggleTodo');
			this.dispatcher.register('remove', this.store, 'removeTodo');

			this.listenTo(this.store, 'change', this.render);
		},

		create: function create() {
			this.dispatcher.create(prompt('Title'));
		},

		render: function() {

			var todosElement = this.$el.find('#todos');

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
		tagName: 'div',
		className: 'todo',

		template: _.template('<input type=\'checkbox\' <% if(complete) { print(\'checked="checked"\'); } %>/><span class="<% if(complete) { print(\'checked\'); }%>"><%= title %></span> <span class="remove">x</span>'),

		events: {
			'click input': 'toggle',
			'click .remove': 'remove'
		},

		initialize: function() {
			this.listenTo(this.model, 'change', this.render.bind(this));
		},

		toggle: function() {
			backboneApp.dispatcher.toggle(this.model);
			this.render();
		},

		remove: function() {
			backboneApp.dispatcher.remove(this.model)
		},

		render: function () {
			this.$el.html(this.template(this.model.attributes));

			return this.$el;
		}
	});

	var backboneApp = new TodoAppBackbone({
		el: document.getElementById('app')
	});

	backboneApp.render();
});
