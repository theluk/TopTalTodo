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
            return Model.Priorities[this.get("priority")]["class"];
        },
        getPriorityName : function() {
            return Model.Priorities[this.get("priority")]["name"];
        },
        parse: function (data) {
            if (!data) return data;
            _.each(["dueDate"], _.bind(function (n) {
                if (typeof data[n] != "undefined") data[n] = this._parseDate(data[n]);
            }, this));
            return data;
        }
    }, {
        Priorities : {
            0: {
                "id" : "priorityLow",
                "class": "label label-success",
                "name" : "Low",
                "filter" : function(model) {
                    return model.get("priority") == 0;
                }
            },
            1: {
                "id" : 'priorityMedium',
                "class": "label label-warning",
                "name": "Medium",
                "filter" : function(model) {
                    return model.get("priority") == 1;
                }
            },
            2: {
                "id" : "priorityHigh",
                "class": "label label-important",
                "name": "High",
                "filter" : function(model) {
                    return model.get("priority") == 2;
                }
            }
        }
    });

    var Collection = app.Todos = Backbone.Collection.extend({
        model: Model,
        url: "/api/todo",
        initialize : function() {
            this._filterFunctions = {};
            this.filterComparator = "OR";
        },
        syncPriorityFilter : function(values) {
            _.each(_.pluck(Model.Priorities, "id"), function (id) {
                this.removeFilter(id, { silent: true });
            }, this);
            _.each(values, function (key) {
                this.addFilter(Model.Priorities[key].id, Model.Priorities[key].filter, { silent: true });
            }, this);
            this.trigger("reset");
        },
        addFilter: function (name, fn, options) {
            options || (options = {});
            this._filterFunctions[name] = fn;
            if (!options.silent) this.trigger("reset");
        },
        removeFilter: function (name, options) {
            options || (options = {});
            delete this._filterFunctions[name];
            if (!options.silent) this.trigger("reset");
        },
        filtered : function() {
            return this.filter(_.bind(function (model) {
                var fns = _.keys(this._filterFunctions);
                for (var i = 0; i < fns.length; i++) {
                    if (this.filterComparator == "AND" && !this._filterFunctions[fns[i]](model))
                        return false;
                    if (this.filterComparator == "OR" && this._filterFunctions[fns[i]](model))
                        return true;
                }
                return this.filterComparator == "AND" || fns.length == 0;
            }, this));
        },
        todoCount: function () {
            return this.filter(function(i) {return !i.isNew()}).length
        },
        doneCount: function () {
            return this.where({done:true}).length
        }
    });

})();