Imports System.Web.Http
Imports System.Net.Http

Public Class TodoController
    Inherits ApiController

    Private repository As New TodoRepository

    ' GET /api/todo
    Public Function GetTodos() As IEnumerable(Of Todo)
        Return repository.GetAll
    End Function

    ' GET /api/todo/5
    Public Function GetTodo(ByVal id As Guid) As Todo
        Return repository.Get(id)
    End Function

    ' POST /api/todo
    Public Function PostTodo(ByVal value As Todo) As HttpResponseMessage
        If ModelState.IsValid Then
            Dim result = repository.Add(value)
            Dim response = Request.CreateResponse(Net.HttpStatusCode.Created)
            response.Content = response.CreateContent(Of Todo)(result)

            Dim uri As String = Url.Route("DefaultApi", New With {.controller = "Todo", .id = result.id})
            response.Headers.Location = New Uri(uri, UriKind.RelativeOrAbsolute)
            Return response
        Else
            Return Request.CreateResponse(Net.HttpStatusCode.BadRequest)
        End If
    End Function

    ' PUT /api/todo/5
    Public Function PutTodo(ByVal id As Guid, ByVal value As Todo) As HttpResponseMessage(Of Todo)
        If ModelState.IsValid Then
            Dim result = repository.Update(value)
            Return New HttpResponseMessage(Of Todo)(value)
        Else
            Return New HttpResponseMessage(Of Todo)(Net.HttpStatusCode.BadRequest)
        End If
    End Function

    ' DELETE /api/todo/5
    Public Sub DeleteValue(ByVal id As Guid)
        repository.Remove(id)
    End Sub

End Class
