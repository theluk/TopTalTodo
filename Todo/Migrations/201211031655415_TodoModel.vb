Imports System
Imports System.Data.Entity.Migrations

Namespace Migrations
    Public Partial Class TodoModel
        Inherits DbMigration
    
        Public Overrides Sub Up()
            CreateTable(
                "dbo.Todoes",
                Function(c) New With
                    {
                        .id = c.Guid(nullable := False, identity := True),
                        .name = c.String(),
                        .done = c.Boolean(nullable := False),
                        .dueDate = c.DateTime(),
                        .priority = c.Int()
                    }) _
                .PrimaryKey(Function(t) t.id)
            
        End Sub
        
        Public Overrides Sub Down()
            DropTable("dbo.Todoes")
        End Sub
    End Class
End Namespace
