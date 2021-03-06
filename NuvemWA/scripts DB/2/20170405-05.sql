/*
   miércoles, 05 de abril de 201709:45:20 p.m.
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
ALTER TABLE dbo.Items
	DROP CONSTRAINT DF__Items__ItemPrice__0AD2A005
GO
ALTER TABLE dbo.Items
	DROP CONSTRAINT DF__Items__ItemCreat__0BC6C43E
GO
ALTER TABLE dbo.Items
	DROP CONSTRAINT DF_Items_rowguid
GO
CREATE TABLE dbo.Tmp_Items
	(
	ItemKey int NOT NULL IDENTITY (1, 1),
	ItemType int NOT NULL,
	ItemName nvarchar(200) NOT NULL,
	ItemDescription text NULL,
	ItemPartNumber nvarchar(30) NULL,
	ItemLastPrice decimal(18, 2) NULL,
	ItemCreatedByUserKey int NOT NULL,
	ItemCreatedDate datetime NOT NULL,
	ItemModifiedByUserKey int NULL,
	ItemModifiedDate datetime NULL,
	ItemWeight decimal(18, 2) NULL,
	ItemVolume decimal(18, 2) NULL,
	ItemWidth decimal(18, 2) NULL,
	ItemHeight decimal(18, 2) NULL,
	ItemLength decimal(18, 2) NULL,
	ItemIMPA nvarchar(20) NULL,
	ItemNCM nvarchar(20) NULL,
	ItemBrand nchar(200) NULL,
	rowguid nvarchar(40) NOT NULL
	)  ON [PRIMARY]
	 TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE dbo.Tmp_Items SET (LOCK_ESCALATION = TABLE)
GO
ALTER TABLE dbo.Tmp_Items ADD CONSTRAINT
	DF__Items__ItemPrice__0AD2A005 DEFAULT ((0)) FOR ItemLastPrice
GO
ALTER TABLE dbo.Tmp_Items ADD CONSTRAINT
	DF__Items__ItemCreat__0BC6C43E DEFAULT (getdate()) FOR ItemCreatedDate
GO
ALTER TABLE dbo.Tmp_Items ADD CONSTRAINT
	DF_Items_rowguid DEFAULT (newid()) FOR rowguid
GO
SET IDENTITY_INSERT dbo.Tmp_Items ON
GO
IF EXISTS(SELECT * FROM dbo.Items)
	 EXEC('INSERT INTO dbo.Tmp_Items (ItemKey, ItemType, ItemName, ItemDescription, ItemPartNumber, ItemLastPrice, ItemCreatedByUserKey, ItemCreatedDate, ItemModifiedByUserKey, ItemModifiedDate, ItemWeight, ItemVolume, ItemWidth, ItemHeight, ItemLength, ItemIMPA, ItemNCM, rowguid)
		SELECT ItemKey, ItemType, ItemName, ItemDescription, ItemPartNumber, ItemLastPrice, ItemCreatedByUserKey, ItemCreatedDate, ItemModifiedByUserKey, ItemModifiedDate, ItemWeight, ItemVolume, ItemWidth, ItemHeight, ItemLength, ItemIMPA, ItemNCM, rowguid FROM dbo.Items WITH (HOLDLOCK TABLOCKX)')
GO
SET IDENTITY_INSERT dbo.Tmp_Items OFF
GO
ALTER TABLE dbo.QuoteDetails
	DROP CONSTRAINT FK_QuoteDetails_Items
GO
ALTER TABLE dbo.QuoteOfferDetails
	DROP CONSTRAINT FK_QuoteOfferDetails_Items
GO
ALTER TABLE dbo.Attachments
	DROP CONSTRAINT FK_Attachments_Items
GO
DROP TABLE dbo.Items
GO
EXECUTE sp_rename N'dbo.Tmp_Items', N'Items', 'OBJECT' 
GO
ALTER TABLE dbo.Items ADD CONSTRAINT
	PK_Items PRIMARY KEY CLUSTERED 
	(
	ItemKey
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
CREATE UNIQUE NONCLUSTERED INDEX IX_Items ON dbo.Items
	(
	ItemName
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.Attachments WITH NOCHECK ADD CONSTRAINT
	FK_Attachments_Items FOREIGN KEY
	(
	ItemKey
	) REFERENCES dbo.Items
	(
	ItemKey
	) ON UPDATE  NO ACTION 
	 ON DELETE  CASCADE 
	
GO
ALTER TABLE dbo.Attachments
	NOCHECK CONSTRAINT FK_Attachments_Items
GO
ALTER TABLE dbo.Attachments SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.QuoteOfferDetails ADD CONSTRAINT
	FK_QuoteOfferDetails_Items FOREIGN KEY
	(
	ItemKey
	) REFERENCES dbo.Items
	(
	ItemKey
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.QuoteOfferDetails SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.QuoteDetails ADD CONSTRAINT
	FK_QuoteDetails_Items FOREIGN KEY
	(
	ItemKey
	) REFERENCES dbo.Items
	(
	ItemKey
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.QuoteDetails SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
