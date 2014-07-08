Backbone.Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate) {
    return Handlebars.compile(rawTemplate);
};

var UserAction = Backbone.Model.extend({});

var UserActions = Backbone.Collection.extend({
    url: 'api/users/actions',
    model: UserAction
});

var ActionView = Backbone.Marionette.ItemView.extend({
    template: $('#idea-link-clicked-template')
//    template: _.template('<%-author_name%>')
});

var ActionStack = Backbone.Marionette.CollectionView.extend({
    childView: ActionView
});

(function() {
    var actions = new UserActions([
        {
            "id": "68E27356-0064-11E4-AEFD-96F9DE56FB62",
            "author_name": "Marina Mata",
            "eventType": "IdeaLinkClicked",
            "recipient": "fcruz",
            "stock_name": "Lojas Renner SA",
            "stock_ticker": "LREN3 BZ",
            "timestamp": "2014-06-30T14:39:57.128+0000",
            "message": "IdeaLinkClicked"
        }, {
            "id": "AAA27356-0064-11E4-AEFD-96F9DE56FB62",
            "author_name": "John Smite",
            "eventType": "IdeaLinkClicked",
            "recipient": "fcruz",
            "stock_name": "Startbucks Inc",
            "stock_ticker": "SBU L",
            "timestamp": "2014-06-03T04:39:57.128+0000",
            "message": "IdeaLinkClicked"
        }
    ]);

    var view = new ActionStack({ collection: actions });

    var mainRegion = new Backbone.Marionette.Region({
        el: '#main-container'
    });
    mainRegion.show(view);
})();