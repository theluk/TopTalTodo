Imports System.ComponentModel.DataAnnotations
Imports System.ComponentModel.DataAnnotations.Schema

Public Class Todo

    <Key(), DatabaseGenerated(DatabaseGeneratedOption.Identity)> _
    Property id As Guid
    Property name As String
    Property done As Boolean
    Property dueDate As Nullable(Of Date)
    Property priority As Nullable(Of Integer)

End Class
