Imports System.Data.Entity

Public Class Todo2Controller
    Inherits System.Web.Mvc.Controller

    Private db As New todo_db

    '
    ' GET: /Todo2/

    Function Index() As ActionResult
        Return View(db.todos.ToList())
    End Function

    '
    ' GET: /Todo2/Details/5

    Function Details(Optional ByVal id As Guid = Nothing) As ActionResult
        Dim todo As Todo = db.todos.Find(id)
        If IsNothing(todo) Then
            Return HttpNotFound()
        End If
        Return View(todo)
    End Function

    '
    ' GET: /Todo2/Create

    Function Create() As ActionResult
        Return View()
    End Function

    '
    ' POST: /Todo2/Create

    <HttpPost()> _
    Function Create(ByVal todo As Todo) As ActionResult
        If ModelState.IsValid Then
            todo.id = Guid.NewGuid()
            db.todos.Add(todo)
            db.SaveChanges()
            Return RedirectToAction("Index")
        End If

        Return View(todo)
    End Function

    '
    ' GET: /Todo2/Edit/5

    Function Edit(Optional ByVal id As Guid = Nothing) As ActionResult
        Dim todo As Todo = db.todos.Find(id)
        If IsNothing(todo) Then
            Return HttpNotFound()
        End If
        Return View(todo)
    End Function

    '
    ' POST: /Todo2/Edit/5

    <HttpPost()> _
    Function Edit(ByVal todo As Todo) As ActionResult
        If ModelState.IsValid Then
            db.Entry(todo).State = EntityState.Modified
            db.SaveChanges()
            Return RedirectToAction("Index")
        End If

        Return View(todo)
    End Function

    '
    ' GET: /Todo2/Delete/5

    Function Delete(Optional ByVal id As Guid = Nothing) As ActionResult
        Dim todo As Todo = db.todos.Find(id)
        If IsNothing(todo) Then
            Return HttpNotFound()
        End If
        Return View(todo)
    End Function

    '
    ' POST: /Todo2/Delete/5

    <HttpPost()> _
    <ActionName("Delete")> _
    Function DeleteConfirmed(ByVal id As Guid) As RedirectToRouteResult
        Dim todo As Todo = db.todos.Find(id)
        db.todos.Remove(todo)
        db.SaveChanges()
        Return RedirectToAction("Index")
    End Function

    Protected Overrides Sub Dispose(ByVal disposing As Boolean)
        db.Dispose()
        MyBase.Dispose(disposing)
    End Sub

End Class