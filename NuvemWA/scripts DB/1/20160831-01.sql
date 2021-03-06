/*
   miércoles, 31 de agosto de 201611:06:59 a.m.
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
ALTER TABLE dbo.Cities SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.States SET (LOCK_ESCALATION = TABLE)
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
	DF_Vendors_rowguid DEFAULT (newid()) FOR rowguid
GO
SET IDENTITY_INSERT dbo.Tmp_Vendors ON
GO
IF EXISTS(SELECT * FROM dbo.Vendors)
	 EXEC('INSERT INTO dbo.Tmp_Vendors (VendorKey, VendorName, VendorCreatedByUserKey, VendorCreatedDate, VendorModifiedByUserKey, VendorModifiedDate, rowguid)
		SELECT VendorKey, VendorName, VendorCreatedByUserKey, VendorCreatedDate, VendorModifiedByUserKey, VendorModifiedDate, rowguid FROM dbo.Vendors WITH (HOLDLOCK TABLOCKX)')
GO
SET IDENTITY_INSERT dbo.Tmp_Vendors OFF
GO
ALTER TABLE dbo.Users
	DROP CONSTRAINT FK_Users_Vendors
GO
ALTER TABLE dbo.VendorShipAddress
	DROP CONSTRAINT FK_VendorShipAddress_Vendors
GO
ALTER TABLE dbo.Attachments
	DROP CONSTRAINT FK_Attachments_Vendors
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
ALTER TABLE dbo.Vendors ADD CONSTRAINT
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
ALTER TABLE dbo.Vendors ADD CONSTRAINT
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
