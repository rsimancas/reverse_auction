/*
   domingo, 13 de marzo de 201602:10:40 p.m.
   Usuario: 
   Servidor: .
   Base de datos: Nuvem
   Aplicación: 
*/

/* Para evitar posibles problemas de pérdida de datos, debe revisar este script detalladamente antes de ejecutarlo fuera del contexto del diseñador de base de datos.*/
BEGIN TRANSACTION
SET QUOTED_IDENTIFIER ON
SET ARITHABORT ON
SET NUMERIC_ROUNDABORT OFF
SET CONCAT_NULL_YIELDS_NULL ON
SET ANSI_NULLS ON
SET ANSI_PADDING ON
SET ANSI_WARNINGS ON
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.QuoteHeaders
	DROP CONSTRAINT FK_QuoteHeaders_Items
GO
ALTER TABLE dbo.Items SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.Customers SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.CustShipAddress SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.QuoteHeaders
	DROP CONSTRAINT DF__QuoteHead__QHead__49C3F6B7
GO
CREATE TABLE dbo.Tmp_QuoteHeaders
	(
	QHeaderKey int NOT NULL IDENTITY (1, 1),
	QHeaderDateBegin datetime NULL,
	QHeaderDateEnd datetime NULL,
	QHeaderNum nvarchar(50) NOT NULL,
	QHeaderIMPA nvarchar(20) NULL,
	QHeaderQty numeric(18, 6) NULL,
	CustKey int NOT NULL,
	CustShipKey int NOT NULL,
	QHeaderOC nvarchar(20) NULL,
	QHeaderOCDate datetime NULL,
	QHeaderCreatedByUserKey int NOT NULL,
	QHeaderCreatedDate datetime NOT NULL,
	QHeaderModifiedByUserKey int NULL,
	QHeaderModifiedDate datetime NULL,
	QHeaderEstimatedDate datetime NULL,
	QHeaderComments nvarchar(MAX) NULL,
	QHeaderDraft bit NOT NULL,
	ItemKey int NOT NULL,
	rowguid nvarchar(40) NULL
	)  ON [PRIMARY]
	 TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE dbo.Tmp_QuoteHeaders SET (LOCK_ESCALATION = TABLE)
GO
ALTER TABLE dbo.Tmp_QuoteHeaders ADD CONSTRAINT
	DF__QuoteHead__QHead__49C3F6B7 DEFAULT (getdate()) FOR QHeaderCreatedDate
GO
SET IDENTITY_INSERT dbo.Tmp_QuoteHeaders ON
GO
IF EXISTS(SELECT * FROM dbo.QuoteHeaders)
	 EXEC('INSERT INTO dbo.Tmp_QuoteHeaders (QHeaderKey, QHeaderDateBegin, QHeaderDateEnd, QHeaderNum, QHeaderIMPA, QHeaderQty, QHeaderOC, QHeaderOCDate, QHeaderCreatedByUserKey, QHeaderCreatedDate, QHeaderModifiedByUserKey, QHeaderModifiedDate, QHeaderEstimatedDate, QHeaderComments, QHeaderDraft, ItemKey, rowguid)
		SELECT QHeaderKey, QHeaderDateBegin, QHeaderDateEnd, QHeaderNum, QHeaderIMPA, QHeaderQty, QHeaderOC, QHeaderOCDate, QHeaderCreatedByUserKey, QHeaderCreatedDate, QHeaderModifiedByUserKey, QHeaderModifiedDate, QHeaderEstimatedDate, QHeaderComments, QHeaderDraft, ItemKey, rowguid FROM dbo.QuoteHeaders WITH (HOLDLOCK TABLOCKX)')
GO
SET IDENTITY_INSERT dbo.Tmp_QuoteHeaders OFF
GO
DROP TABLE dbo.QuoteHeaders
GO
EXECUTE sp_rename N'dbo.Tmp_QuoteHeaders', N'QuoteHeaders', 'OBJECT' 
GO
ALTER TABLE dbo.QuoteHeaders ADD CONSTRAINT
	PK_QuoteHeader PRIMARY KEY CLUSTERED 
	(
	QHeaderKey
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
CREATE NONCLUSTERED INDEX IX_QuoteHeader_Date ON dbo.QuoteHeaders
	(
	QHeaderDateBegin
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
CREATE UNIQUE NONCLUSTERED INDEX IX_QuoteHeader_Reference ON dbo.QuoteHeaders
	(
	QHeaderNum
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE dbo.QuoteHeaders ADD CONSTRAINT
	FK_QuoteHeaders_Items FOREIGN KEY
	(
	ItemKey
	) REFERENCES dbo.Items
	(
	ItemKey
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.QuoteHeaders ADD CONSTRAINT
	FK_QuoteHeaders_Customers FOREIGN KEY
	(
	CustKey
	) REFERENCES dbo.Customers
	(
	CustKey
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.QuoteHeaders ADD CONSTRAINT
	FK_QuoteHeaders_CustShipAddress FOREIGN KEY
	(
	CustShipKey
	) REFERENCES dbo.CustShipAddress
	(
	CustShipKey
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
COMMIT
