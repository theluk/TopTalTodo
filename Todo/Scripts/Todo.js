; (function () {
    
    var app = window.TodoApp || (window.TodoApp = {})

    var Model = app.Todo = Backbone.Model.extend({
        isReadOnly : true,
        defaults: {
            priority: 0,
            done : false
        },
        _parseDate: function (value) {
            if (value && value.indexOf("/") == 0 && value.lastIndexOf("/") == value.length - 1) {
                var date = (new Function("return new " + value.substring(1, value.length - 1)))();
                var month = (date.getMonth() + 1).toString().length == 1 ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1);
                var day = (date.getDate()).toString().length == 1 ? "0" + (date.getDate()).toString() : (date.getDate());
                return date.getFullYear() + "-" + month + "-" + day;
            } else {
                return value;
            }
        },
        validate : function(data) {
            if (!data.name || data.name.length == 0)
                return "Please add a Todo";
        },
        getPriorityClass : function() {
            return {
                0: "label label-success",
                1: "label label-warning",
                2: "label label-important"
            }[this.get("priority")];
        },
        getPriorityName : function() {
            return {
                0: "Low",
                1: "Medium",
                2: "High"
            }[this.get("priority")];
        },
        parse: function (data) {
            if (!data) return data;
            _.each(["dueDate"], _.bind(function (n) {
                if (typeof data[n] != "undefined") data[n] = this._parseDate(data[n]);
            }, this));
            return data;
        }
    });

    var Collection = app.Todos = Backbone.Collection.extend({
        model: Model,
        url: "/api/todo",
        todoCount: function () {
            return this.filter(function(i) {return !i.isNew()}).length
        },
        doneCount: function () {
            return this.where({done:true}).length
        }
    });

})();