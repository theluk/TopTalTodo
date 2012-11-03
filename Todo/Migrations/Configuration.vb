Imports System
Imports System.Data.Entity
Imports System.Data.Entity.Migrations
Imports System.Linq

Namespace Migrations

    Friend NotInheritable Class Configuration 
        Inherits DbMigrationsConfiguration(Of todo_db)

        Public Sub New()
            AutomaticMigrationsEnabled = True
        End Sub

    End Class

End Namespace
