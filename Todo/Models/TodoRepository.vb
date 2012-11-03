Public Interface ITodoRepository

    Function GetAll() As IEnumerable(Of Todo)
    Function [Get](id As Guid) As Todo
    Function Add(todo As Todo) As Todo
    Sub Remove(id As Guid)
    Function Update(todo As Todo) As Todo

End Interface

Public Class TodoRepository
    Implements ITodoRepository

    Private db As New todo_db

    Public Function Add(todo As Todo) As Todo Implements ITodoRepository.Add
        If todo Is Nothing Then
            Throw New ArgumentNullException("todo")
        End If
        db.todos.Add(todo)
        db.SaveChanges()
        Return todo
    End Function

    Public Function [Get](id As Guid) As Todo Implements ITodoRepository.Get
        Return db.todos.Where(Function(i) i.id = id).SingleOrDefault
    End Function

    Public Function GetAll() As IEnumerable(Of Todo) Implements ITodoRepository.GetAll
        Return db.todos
    End Function

    Public Sub Remove(id As Guid) Implements ITodoRepository.Remove
        db.todos.Remove(Me.Get(id))
        db.SaveChanges()
    End Sub

    Public Function Update(todo As Todo) As Todo Implements ITodoRepository.Update
        db.Entry(todo).State = EntityState.Modified
        db.SaveChanges()
        Return todo
    End Function
End Class
