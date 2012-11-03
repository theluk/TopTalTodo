; (function () {

    //set up rivets to make it work with backbone and our todo app
    if (typeof window.rivets != "undefined")
        rivets.configure({
            adapter: {
                subscribe: function (obj, keypath, callback) {
                    obj.on('change:' + keypath, callback)
                },
                unsubscribe: function (obj, keypath, callback) {
                    obj.off('change:' + keypath, callback)
                },
                read: function (obj, keypath) {
                    return obj.get(keypath)
                },
                publish: function (obj, keypath, value) {
                    obj.set(keypath, value)
                }
            }
        });

    rivets.formatters.date = function (value) {
        return value ? value.parseSqlDate().format(dateFormat.masks.fullDate) : "";
    };

    var app = window.TodoApp || (window.TodoApp = {})

    app.Router = Backbone.Router.extend({

        initialize : function() {
            this.todos = new app.Todos();
            this.mainView = new app.MainView({
                router: this,
                collection : this.todos
            });
            this.mainView.render();
            this.todos.fetch();
        },
        
    });

    $(function () {
        
        window.todo_app = new TodoApp.Router();
        //Backbone.history.start();

    });

})();