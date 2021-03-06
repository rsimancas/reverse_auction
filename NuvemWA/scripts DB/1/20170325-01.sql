/*
   sábado, 25 de marzo de 201708:54:19 p.m.
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
ALTER TABLE dbo.Vendors
	DROP CONSTRAINT FK_Vendors_States
GO
ALTER TABLE dbo.States SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.Vendors
	DROP CONSTRAINT FK_Vendors_Cities
GO
ALTER TABLE dbo.Cities SET (LOCK_ESCALATION = TABLE)
GO
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
	 EXEC('INSERT INTO dbo.Tmp_Items (ItemKey, ItemType, ItemName, ItemPartNumber, ItemLastPrice, ItemCreatedByUserKey, ItemCreatedDate, ItemModifiedByUserKey, ItemModifiedDate, ItemWeight, ItemVolume, ItemWidth, ItemHeight, ItemLength, ItemIMPA, ItemNCM, rowguid)
		SELECT ItemKey, ItemType, CONVERT(nvarchar(200), ItemName), ItemPartNumber, ItemLastPrice, ItemCreatedByUserKey, ItemCreatedDate, ItemModifiedByUserKey, ItemModifiedDate, ItemWeight, ItemVolume, ItemWidth, ItemHeight, ItemLength, ItemIMPA, ItemNCM, rowguid FROM dbo.Items WITH (HOLDLOCK TABLOCKX)')
GO
SET IDENTITY_INSERT dbo.Tmp_Items OFF
GO
ALTER TABLE dbo.QuoteDetails
	DROP CONSTRAINT FK_QuoteDetails_Items
GO
ALTER TABLE dbo.Attachments
	DROP CONSTRAINT FK_Attachments_Items
GO
ALTER TABLE dbo.QuoteOfferDetails
	DROP CONSTRAINT FK_QuoteOfferDetails_Items
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
ALTER TABLE dbo.Vendors
	DROP CONSTRAINT DF__Vendors__VendorC__534D60F1
GO
ALTER TABLE dbo.Vendors
	DROP CONSTRAINT DF_Vendors_rowguid
GO
CREATE TABLE dbo.Tmp_Vendors
	(
	VendorKey int NOT NULL IDENTITY (1, 1),
	VendorName nvarchar(200) NOT NULL,
	VendorEmail nvarchar(200) NULL,
	VendorCompanyName nvarchar(200) NULL,
	VendorComercialName nvarchar(200) NULL,
	VendorCNPJ nvarchar(20) NULL,
	VendorIE nvarchar(20) NULL,
	VendorIM nvarchar(20) NULL,
	VendorAddress nvarchar(MAX) NULL,
	VendorNeighborhood nvarchar(200) NULL,
	CitiKey int NULL,
	StateKey int NULL,
	VendorPhone1 nvarchar(40) NULL,
	VendorPhone2 nvarchar(40) NULL,
	VendorCreatedByUserKey int NOT NULL,
	VendorCreatedDate datetime NOT NULL,
	VendorModifiedByUserKey int NULL,
	VendorModifiedDate datetime NULL,
	VendorBrasil bit NOT NULL,
	VendorSudeste bit NOT NULL,
	VendorSul bit NOT NULL,
	VendorNordeste bit NOT NULL,
	VendorNorte bit NOT NULL,
	VendorCentroOeste bit NOT NULL,
	rowguid nvarchar(40) NOT NULL
	)  ON [PRIMARY]
	 TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE dbo.Tmp_Vendors SET (LOCK_ESCALATION = TABLE)
GO
ALTER TABLE dbo.Tmp_Vendors ADD CONSTRAINT
	DF__Vendors__VendorC__534D60F1 DEFAULT (getdate()) FOR VendorCreatedDate
GO
ALTER TABLE dbo.Tmp_Vendors ADD CONSTRAINT
	DF_Vendors_VendorBrasil DEFAULT 0 FOR VendorBrasil
GO
ALTER TABLE dbo.Tmp_Vendors ADD CONSTRAINT
	DF_Vendors_VendorSudeste DEFAULT 0 FOR VendorSudeste
GO
ALTER TABLE dbo.Tmp_Vendors ADD CONSTRAINT
	DF_Vendors_VendorSul DEFAULT 0 FOR VendorSul
GO
ALTER TABLE dbo.Tmp_Vendors ADD CONSTRAINT
	DF_Vendors_VendorNordeste DEFAULT 0 FOR VendorNordeste
GO
ALTER TABLE dbo.Tmp_Vendors ADD CONSTRAINT
	DF_Vendors_VendorNorte DEFAULT 0 FOR VendorNorte
GO
ALTER TABLE dbo.Tmp_Vendors ADD CONSTRAINT
	DF_Vendors_VendorCentroOeste DEFAULT 0 FOR VendorCentroOeste
GO
ALTER TABLE dbo.Tmp_Vendors ADD CONSTRAINT
	DF_Vendors_rowguid DEFAULT (newid()) FOR rowguid
GO
SET IDENTITY_INSERT dbo.Tmp_Vendors ON
GO
IF EXISTS(SELECT * FROM dbo.Vendors)
	 EXEC('INSERT INTO dbo.Tmp_Vendors (VendorKey, VendorName, VendorEmail, VendorCompanyName, VendorComercialName, VendorCNPJ, VendorIE, VendorIM, VendorAddress, VendorNeighborhood, CitiKey, StateKey, VendorPhone1, VendorPhone2, VendorCreatedByUserKey, VendorCreatedDate, VendorModifiedByUserKey, VendorModifiedDate, rowguid)
		SELECT VendorKey, VendorName, VendorEmail, VendorCompanyName, VendorComercialName, VendorCNPJ, VendorIE, VendorIM, VendorAddress, VendorNeighborhood, CitiKey, StateKey, VendorPhone1, VendorPhone2, VendorCreatedByUserKey, VendorCreatedDate, VendorModifiedByUserKey, VendorModifiedDate, rowguid FROM dbo.Vendors WITH (HOLDLOCK TABLOCKX)')
GO
SET IDENTITY_INSERT dbo.Tmp_Vendors OFF
GO
ALTER TABLE dbo.QuoteMessages
	DROP CONSTRAINT FK_QuoteMessages_Vendors_To
GO
ALTER TABLE dbo.QuoteOffers
	DROP CONSTRAINT FK_QuoteOffers_Vendors
GO
ALTER TABLE dbo.VendorShipAddress
	DROP CONSTRAINT FK_VendorShipAddress_Vendors
GO
ALTER TABLE dbo.VendorCategories
	DROP CONSTRAINT FK_VendorCategories_Vendors
GO
ALTER TABLE dbo.Users
	DROP CONSTRAINT FK_Users_Vendors
GO
ALTER TABLE dbo.Attachments
	DROP CONSTRAINT FK_Attachments_Vendors
GO
ALTER TABLE dbo.Notifications
	DROP CONSTRAINT FK_Notifications_Vendors
GO
ALTER TABLE dbo.QuoteAnswers
	DROP CONSTRAINT FK_QuoteAnswers_Vendors
GO
ALTER TABLE dbo.QuoteMessages
	DROP CONSTRAINT FK_QuoteMessages_Vendors_From
GO
DROP TABLE dbo.Vendors
GO
EXECUTE sp_rename N'dbo.Tmp_Vendors', N'Vendors', 'OBJECT' 
GO
ALTER TABLE dbo.Vendors ADD CONSTRAINT
	PK_VendorId PRIMARY KEY CLUSTERED 
	(
	VendorKey
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
ALTER TABLE dbo.Vendors WITH NOCHECK ADD CONSTRAINT
	FK_Vendors_Cities FOREIGN KEY
	(
	CitiKey
	) REFERENCES dbo.Cities
	(
	CityKey
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.Vendors
	NOCHECK CONSTRAINT FK_Vendors_Cities
GO
ALTER TABLE dbo.Vendors WITH NOCHECK ADD CONSTRAINT
	FK_Vendors_States FOREIGN KEY
	(
	StateKey
	) REFERENCES dbo.States
	(
	StateKey
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.Vendors
	NOCHECK CONSTRAINT FK_Vendors_States
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.QuoteAnswers ADD CONSTRAINT
	FK_QuoteAnswers_Vendors FOREIGN KEY
	(
	VendorKey
	) REFERENCES dbo.Vendors
	(
	VendorKey
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.QuoteAnswers SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.Notifications WITH NOCHECK ADD CONSTRAINT
	FK_Notifications_Vendors FOREIGN KEY
	(
	VendorKey
	) REFERENCES dbo.Vendors
	(
	VendorKey
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.Notifications
	NOCHECK CONSTRAINT FK_Notifications_Vendors
GO
ALTER TABLE dbo.Notifications SET (LOCK_ESCALATION = TABLE)
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
ALTER TABLE dbo.Attachments WITH NOCHECK ADD CONSTRAINT
	FK_Attachments_Vendors FOREIGN KEY
	(
	VendorKey
	) REFERENCES dbo.Vendors
	(
	VendorKey
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.Attachments
	NOCHECK CONSTRAINT FK_Attachments_Vendors
GO
ALTER TABLE dbo.Attachments SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.Users WITH NOCHECK ADD CONSTRAINT
	FK_Users_Vendors FOREIGN KEY
	(
	VendorKey
	) REFERENCES dbo.Vendors
	(
	VendorKey
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.Users
	NOCHECK CONSTRAINT FK_Users_Vendors
GO
ALTER TABLE dbo.Users SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.VendorCategories ADD CONSTRAINT
	FK_VendorCategories_Vendors FOREIGN KEY
	(
	VendorKey
	) REFERENCES dbo.Vendors
	(
	VendorKey
	) ON UPDATE  NO ACTION 
	 ON DELETE  CASCADE 
	
GO
ALTER TABLE dbo.VendorCategories SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.VendorShipAddress ADD CONSTRAINT
	FK_VendorShipAddress_Vendors FOREIGN KEY
	(
	VendorKey
	) REFERENCES dbo.Vendors
	(
	VendorKey
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.VendorShipAddress SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.QuoteOffers ADD CONSTRAINT
	FK_QuoteOffers_Vendors FOREIGN KEY
	(
	VendorKey
	) REFERENCES dbo.Vendors
	(
	VendorKey
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.QuoteOffers SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.QuoteMessages WITH NOCHECK ADD CONSTRAINT
	FK_QuoteMessages_Vendors_To FOREIGN KEY
	(
	QMessageToVendorKey
	) REFERENCES dbo.Vendors
	(
	VendorKey
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.QuoteMessages
	NOCHECK CONSTRAINT FK_QuoteMessages_Vendors_To
GO
ALTER TABLE dbo.QuoteMessages WITH NOCHECK ADD CONSTRAINT
	FK_QuoteMessages_Vendors_From FOREIGN KEY
	(
	QMessageFromVendorKey
	) REFERENCES dbo.Vendors
	(
	VendorKey
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.QuoteMessages
	NOCHECK CONSTRAINT FK_QuoteMessages_Vendors_From
GO
ALTER TABLE dbo.QuoteMessages SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
