Imports System.Data.Entity

Public Class todo_db
    Inherits DbContext

    Property todos As DbSet(Of Todo)

End Class
