; (function () {

    var app = window.TodoApp || (window.TodoApp = {});

    app.MainView = Backbone.View.extend({
        initialize: function () {
            this.setElement(document.getElementById("main"));
            this.listView = new app.ListView({
                el : this.$(".listview").get(0),
                router: this.options.router,
                collection: this.collection
            });
            this.filterView = new app.FilterView({
                el: this.$(".filterView").get(0),
                router: this.options.router,
                collection : this.collection
            });

        },
        render: function () {
            this.filterView.render();
            this.listView.render();
            return this;
        }
    });

    app.FilterView = Backbone.View.extend({
        initialize: function () {
            this.template = _.template($("#_filterView").html());
            this.collection.on("reset", this.reset, this);
            this._selfResetting = false;
            this.collection.on("add remove reset change:id change:done", function () {
                this.bindingView.sync();
            }, this);
        },
        reset: function () {
            if (!this._selfResetting)
                this._originalModels = this.collection.models;
        },
        events : {
            "click .toggle": "toggle",
            "click .removeDone" : "removeDone",
            "click .priority .btn": "filterPriority",
            "click .sortby .btn.bydate": "sortByDate",
            "click .sortby .btn.bypriority": "sortByPriority",
        },
        removeDone : function() {
            var models = this.collection.where({ done: true });
            _.each(models, function(m) {m.destroy()});
        },
        sortByDate : function() {
            var el = this.$(".sortby .btn.bydate");
            this.sort(el.is(".sort-asc"), "dueDate");
            el.toggleClass("sort-asc");
        },
        sortByPriority : function() {
            var el = this.$(".sortby .btn.bypriority");
            this.sort(el.is(".sort-asc"), "priority");
            el.toggleClass("sort-asc");
        },
        sortFunctions : {
            "dueDate": function (a, b) {
                return !a.get(name) || !b.get(name) || (new Date(a.get(name)) < new Date(b.get(name))) ? f1 : f2
            }
        },
        sort : function(asc, name) {
            var f1, f2, lastComp;
            if (asc)
            { f1 = -1; f2 = 1; }
            else
            { f1 = 1; f2 = -1; }

            var sortFn = {
                "dueDate": function (a, b) {
                    if (a.isNew()) return 1;
                    if (b.isNew()) return -1;
                    return !a.get("dueDate") || !b.get("dueDate") || (new Date(a.get("dueDate")) < new Date(b.get("dueDate"))) ? f1 : f2
                },
                "priority": function (a, b) {
                    if (a.isNew()) return 1;
                    if (b.isNew()) return -1;
                    return !a.get("priority") || !b.get("priority") || a.get("priority") < b.get("priority") ? f1 : f2
                }
            };

            lastComp = this.comparator;
            this.collection.comparator = sortFn[name];
            this.collection.sort();
            this.collection.comparator = lastComp;
        },
        filterPriority: function (ev) {
            setTimeout(_.bind(function () {
                var active = this.$(".priority .btn.active").map(function () { return $(this).data("value") }).get();
                this._selfResetting = true;
                if (active.length == 0) {
                    this.collection.reset(this._originalModels);
                } else {
                    this.collection.reset(_.filter(this._originalModels, function (model) {
                        return _.contains(active, parseInt(model.get("priority")));
                    }));
                }
                this._selfResetting = false;
            }, this), 0);
        },
        toggle : function() {
            this.$(".content").toggle();
        },
        render: function () {
            this.$(".content").html(this.template());
            this.bindingView = rivets.bind(this.el, {
                model: {
                    todoCount: _.bind(this.collection.todoCount, this.collection),
                    doneCount: _.bind(this.collection.doneCount, this.collection)
                }
            });
            return this;
        }
    });

    app.ListView = Backbone.View.extend({
        initialize: function () {
            this.views = {};
            this.collection
                .on("reset", this.render, this)
                .on("add", this.addChild, this)
                .on("remove", this.removeChild, this)
        },
        events : {
            "click .add-new-todo":"addNewTodo"
        },
        addNewTodo : function() {
            var model = new app.Todo();
            model.isReadOnly = false;
            this.collection.add(model);
            this.$(".emptyView").hide();
        },
        addChild: function (model) {
            var element = new app.ItemView({
                model: model,
                router: this.options.router,
                listView : this
            });
            this.views[model.cid] = element;
            this.$el.find(".todos").append(element.render().el);
            this.$(".emptyView").hide();
        },
        removeChild: function (model) {
            if (this.views[model.cid]) {
                this.views[model.cid].remove();
                delete this.views[model.cid];
            }
            if (this.collection.length == 0) 
                this.$(".emptyView").show();
        },
        empty: function () {
            _.each(_.keys(this.views), _.bind(function (key) {
                this.views[key].remove();
                delete this.views[key];
            }, this));
            this.$(".todos").empty();
        },
        render: function () {
            this.empty();
            if (this.collection.length) {
                this.$(".emptyView").hide();
                this.collection.each(_.bind(this.addChild, this));
            } else {
                this.$(".emptyView").show();
            }
        }
    });

    app.ItemView = Backbone.View.extend({
        tagName: "li",
        className : "todoItem",
        initialize: function () {
            this.template = _.template($("#_itemView").html());
            this._previous = _.clone(this.model.attributes);
            this.model.on("change:done", function () {
                this.model.save();
            }, this);
            
        },
        remove: function () {
            this.model.off(null, null, this);
            Backbone.View.prototype.remove.apply(this, arguments);
        },
        events : {
            "click .row-fluid": "edit",
            "click button.save": "read",
            "click button.discard": "discard",
        },
        edit: function (ev) {
            if ($(ev.target || ev.srcElement).is("input")) return;
            this.model.isReadOnly = false;
            this.bindingView.sync();
        },
        discard: function () {
            this.model.set(this._previous);
            if (this.model.isNew()) 
                this.model.collection.remove(this.model);
            this.read(null, false);
        },
        read: function (ev, save) {
            if (!this.model.isValid()) {
                this.$(".alert").show();
                return false;
            }
            this.$(".alert").hide();
            this.model.isReadOnly = true;
            this.bindingView.sync();
            if (typeof save == "undefined" || save === true) {
                var value = parseInt(this.$(".priority button.active").data("value"));
                this.model.set("priority", value);
                this._previous = _.clone(this.model.attributes);
                this.model.save();
            }
        },
        render: function () {
            if (!this.model) this.remove();
            this.$el.html(this.template({model : this.model.toJSON(), cid : this.cid}));
            this.bindingView = rivets.bind(this.el, { model: this.model });
            this.$('[data-value="model.dueDate"]').datepicker({ dateFormat: "yy-mm-dd" });
            return this;
        }
    });


})();