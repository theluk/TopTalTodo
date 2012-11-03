@Code
    Layout = Nothing
End Code
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>My Todo App...</title>
    <link href="@Url.Content("~/Content/themes/base/jquery-ui.css")" rel="stylesheet" type="text/css" />
    <link href="@Url.Content("~/Content/themes/bootstrap/css/bootstrap.css")" rel="stylesheet" type="text/css" />
    <link href="@Url.Content("~/Content/themes/base/main.css")" rel="stylesheet" type="text/css" />

    <script src="@Url.Content("~/Scripts/jquery-1.8.2.js")"></script>
    <script src="@Url.Content("~/Scripts/jquery-ui-1.9.0.js")"></script>
    <script src="@Url.Content("~/Scripts/bootstrap.js")"></script>
    <script src="@Url.Content("~/Scripts/format.js")"></script>
    <script src="@Url.Content("~/Scripts/underscore.js")"></script>
    <script src="@Url.Content("~/Scripts/backbone.js")"></script>
    <script src="@Url.Content("~/Scripts/rivets.min.js")"></script>
    <script src="@Url.Content("~/Scripts/Todo.js")"></script>
    <script src="@Url.Content("~/Scripts/View.js")"></script>
    <script src="@Url.Content("~/Scripts/Router.js")"></script>
</head>
<body>
    <section id="main" class="wrapper">
        <div class="filterView">
            <div class="pull-right">
                <button class="btn removeDone">Remove Done</button>
                <button class="btn toggle">Filter</button>
            </div>
            <h1>My Todos</h1>
            <p>You have <strong data-text="model:todoCount"></strong> Todos in Your list. <strong data-text="model:doneCount"></strong> of them are done.</p>
            <div class="content well well-small" style="display: none">
                
            </div>
        </div>
        <div class="listview">
            <div class="alert alert-info emptyView" style="text-align: center;">
                <strong>You don't have any todos, create one!</strong>
            </div>
            <ol class="todos">
                
            </ol>
            <a href="#" class="btn add-new-todo">Add new todo</a>
        </div>

    </section>

    <script type="text/template" id="_filterView">
        <div class="row-fluid">
            <div class="span6">
                <h6>Filter by Priority</h6>
                <div class="btn-group priority" data-toggle="buttons-checkbox">
                    <button class="btn" data-value="0">Low</button>
                    <button class="btn" data-value="1">Medium</button>
                    <button class="btn" data-value="2">High</button>
                </div>
            </div>
            <div class="span6">
                <h6>Order by...</h6>
                <div class="sortby">
                    <button class="btn bydate">Date</button>
                    <button class="btn bypriority">Priority</button>
                </div>
            </div>
        </div>
    </script>

    <script type="text/template" id="_itemView">
        <div class="row-fluid readonly" data-show="model:isReadOnly" data-class-done="model.done">
            <div class="span1">
                <div class="controls">
                    <input type="checkbox" data-checked="model.done" />
                </div>
            </div>
            <div class="span11">    
                <div class="pull-right"><span class="label" data-class="model:getPriorityClass < .priority" data-text="model:getPriorityName < .priority"></span></div>
                <h4 data-text="model.name"></h4>
                <span class="muted" data-text="model.dueDate | date"></span>
            </div>
        </div>
        <div data-hide="model:isReadOnly">
            <div class="form-horizontal">
                <div class="alert alert-error" style="display:none;">
                    <strong>Oh snap!</strong> Change a few things up and try submitting again.
                </div>
                <div class="control-group">
                    <label class="control-label">Todo</label>
                    <div class="controls">
                        <input type="text" data-value="model.name" placeholder="Type something important..." />
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">Priority</label>
                    <div class="controls">
                        <div class="btn-group priority" data-toggle="buttons-radio">
                            <button class="btn<% print(model.priority == 0 ? " active" : "") %>" data-value="0">Low</button>
                            <button class="btn<% print(model.priority == 1 ? " active" : "") %>" data-value="1">Medium</button>
                            <button class="btn<% print(model.priority == 2 ? " active" : "") %>" data-value="2">High</button>
                        </div>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">Due Date</label>
                    <div class="controls">
                        <input type="text" data-value="model.dueDate" />
                    </div>
                </div>
                <div class="form-actions">
                  <button type="submit" class="btn btn-primary save">Save changes</button>
                  <button type="button" class="btn discard">Cancel</button>
                </div>    
            </div>
        </div>
    </script>

</body>
</html>

