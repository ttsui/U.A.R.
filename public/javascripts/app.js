
var UserAction = Backbone.Model.extend({
    idAttribute: "_id"
});

var UserActions = Backbone.Collection.extend({
    url: 'api/activities',
    model: UserAction,
    parse: function(response) {
        return _.sortBy(response, function(event) {
            return event.timestamp;
        });
    }
});

var ActionView = Backbone.Marionette.ItemView.extend({
    
    template: function(data) {
      var key = _.isUndefined(ActionView.eventToTemplateMap[data.eventType]) ? 'UnknownEvent' : data.eventType
      var templateSelector = ActionView.eventToTemplateMap[key];
      var timestamp = moment(data.timestamp);
      data.activityTime = timestamp.format('HH:mm');

      if (timestamp.isBefore(moment().startOf('day'))) {
        data.activityDate = timestamp.format("ddd, D MMM");
      }

      return Handlebars.compile($(templateSelector).html())(data);
    },
    
    className: 'action-card'  
  }, {
    eventToTemplateMap: {
      UnknownEvent: '#generic-template',
      IdeaLinkClicked: '#idea-summary-link-clicked-template',
      AppLoaded: '#app-loaded-template'
    }
  });

var ActionStack = Backbone.View.extend({
  _actions: null,
  _container: null,
  _childViews: new Backbone.ChildViewContainer(),
  _animationDelay: 1000,
    
  initialize: function(options) {
    this._actions = options.actions;
    this._container = options.container;
    this.listenTo(options.actions, 'add', this._onActionAdded);
    this.listenTo(options.actions, 'remove', this._onActionRemoved);
  },
  
  destroy: function() {
    this._childViews.call("destroy");
    this.stopListening();
  },  
  
  render: function() {
    var self = this;
    
    this._container.append(this.el);
    
    this._actions.each(function(action) {
      self._moveExistingCards();      
      self._renderNewCard(action);
    });  
  },      
    
  _moveExistingCards: function() {
    var self = this;
    
    this.$el.queue(function(next) {
      var $existingCards = self.$el.children()
         
       if ($existingCards.length !== 0) {
         $existingCards.wrapAll('<div class="card-stack"> ');
        
         var cardStack = self.$('.card-stack');
                       
         cardStack.animate({ top: '100px' }, 
                           { duration: self._animationDelay , complete: next }); 
      } else {
        next.apply(null, arguments);
      }
    });    
  },
  
  _renderNewCard: function(action) {
    var self = this;
    
    this.$el.queue(function(next) {
      var unwrap = function() {
        self.$('.card-stack .action-card').unwrap();
        next.apply(null, arguments);
      };
      var view = new ActionView({model: action});
      self._childViews.add(view);
                           
      view.render();
      self.$el.prepend(view.el);
      view.$el.animate({ left: '0px' },
                       { duration: self._animationDelay , complete: unwrap });      
    });    
  },
  
  _onActionAdded: function(model) {
    console.log('_onActionAdded()')
    this._moveExistingCards();
    this._renderNewCard(model);    
  },
  
  _onActionRemoved: function(action) {
    console.log('onRemoved()')
    var view = this._childViews.findByModel(action);
    
    this._childViews.remove(view);
    view.$el.fadeOut();
    view.destroy();
  }
});

/*
var SimulatorView = Backbone.Marionette.ItemView.extend({
    _actions: null,
    template: Handlebars.compile( $('#simulator-template').html()),
    className: 'simulator',
    events: {
      'click #new-action': '_onNewAction'
    },
    
    initialize: function(options) {
      this._actions = options.actions;
    },
    
    _onNewAction: function(event) {
        
      this._actions.set([
      ]);
    }
});
*/

(function() {
    var stubEvents = [ ];

//    var activities = new UserActions(stubEvents);
    var activities = new UserActions();
    var view = new ActionStack({ actions: activities, container: $('#main-container') });
    view.render();

    fetchActivity = function() {
        activities.fetch({ sort: true,
                           success: function() { /* _.delay(fetchActivity, 30000); */ } });
    };
    var poll = function() {
        setTimeout(function() {
            fetchActivity();
        }, 10000);
    };

    fetchActivity();
    poll();

//    var simulatorRegion = new Backbone.Marionette.Region({
//        el: '#simulator-container'
//    });
//    simulatorRegion.show(new SimulatorView({ actions: actions }));
          
})();
