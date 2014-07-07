var UserEvents = Backbone.Collection.extend({
    url: 'api/userevents'
});

var UserAction = Backbone.Model.extend({});

var ActionView = Backbone.View.extend({
    _action: null,

    initialize: function(options) {
        this._action = options.action;
    },

    render: function() {
        $('.main-container').html('<h1>' + this._action.get('author_name') + '</h1>');
    }
});

(function() {
    var aUserAction = new UserAction({
        "id": "68E27356-0064-11E4-AEFD-96F9DE56FB62",
        "author_name": "Marina Mata",
        "eventType": "IdeaLinkClicked",
        "recipient": "fcruz",
        "stock_name": "Lojas Renner SA",
        "stock_ticker": "LREN3 BZ",
        "timestamp": "2014-06-30T14:39:57.128+0000",
        "message": "IdeaLinkClicked"
    });

    var view = new ActionView({action: aUserAction});
    view.render();

})();