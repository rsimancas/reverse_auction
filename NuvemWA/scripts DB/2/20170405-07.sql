/*
   miércoles, 05 de abril de 201709:58:26 p.m.
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
ALTER TABLE dbo.QuoteOffers
	DROP CONSTRAINT FK_QuoteOffers_Currencies
GO
ALTER TABLE dbo.Currencies SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.QuoteOffers
	DROP CONSTRAINT FK_QuoteOffers_QuoteHeaders
GO
ALTER TABLE dbo.QuoteHeaders SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.QuoteOffers
	DROP CONSTRAINT FK_QuoteOffers_Vendors
GO
ALTER TABLE dbo.Vendors SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.QuoteOffers
	DROP CONSTRAINT DF_QuoteOffers_QOfferCreatedDate
GO
ALTER TABLE dbo.QuoteOffers
	DROP CONSTRAINT DF_QuoteOffers_QOfferAccepted
GO
ALTER TABLE dbo.QuoteOffers
	DROP CONSTRAINT DF_QuoteOffers_QOfferDraft
GO
ALTER TABLE dbo.QuoteOffers
	DROP CONSTRAINT DF_QuoteOffers_rowguid
GO
CREATE TABLE dbo.Tmp_QuoteOffers
	(
	QOfferKey int NOT NULL IDENTITY (1, 1),
	QHeaderKey int NOT NULL,
	VendorKey int NOT NULL,
	QOfferComments text NULL,
	QOfferValue decimal(18, 6) NOT NULL,
	QOfferDeliveryDate datetime NOT NULL,
	QOfferCreatedByUserKey int NOT NULL,
	QOfferCreatedDate datetime NOT NULL,
	QOfferModifiedByUserKey int NULL,
	QOfferModifiedDate datetime NULL,
	QOfferAccepted int NOT NULL,
	QOfferAcceptedDate datetime NULL,
	QOfferDraft bit NULL,
	CurrencyCode nchar(3) NULL,
	QOfferStatus int NOT NULL,
	rowguid nvarchar(40) NOT NULL
	)  ON [PRIMARY]
	 TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE dbo.Tmp_QuoteOffers SET (LOCK_ESCALATION = TABLE)
GO
ALTER TABLE dbo.Tmp_QuoteOffers ADD CONSTRAINT
	DF_QuoteOffers_QOfferCreatedDate DEFAULT (getdate()) FOR QOfferCreatedDate
GO
ALTER TABLE dbo.Tmp_QuoteOffers ADD CONSTRAINT
	DF_QuoteOffers_QOfferAccepted DEFAULT ((0)) FOR QOfferAccepted
GO
ALTER TABLE dbo.Tmp_QuoteOffers ADD CONSTRAINT
	DF_QuoteOffers_QOfferDraft DEFAULT ((1)) FOR QOfferDraft
GO
ALTER TABLE dbo.Tmp_QuoteOffers ADD CONSTRAINT
	DF_QuoteOffers_QOfferStatis DEFAULT 0 FOR QOfferStatus
GO
ALTER TABLE dbo.Tmp_QuoteOffers ADD CONSTRAINT
	DF_QuoteOffers_rowguid DEFAULT (newid()) FOR rowguid
GO
SET IDENTITY_INSERT dbo.Tmp_QuoteOffers ON
GO
IF EXISTS(SELECT * FROM dbo.QuoteOffers)
	 EXEC('INSERT INTO dbo.Tmp_QuoteOffers (QOfferKey, QHeaderKey, VendorKey, QOfferComments, QOfferValue, QOfferDeliveryDate, QOfferCreatedByUserKey, QOfferCreatedDate, QOfferModifiedByUserKey, QOfferModifiedDate, QOfferAccepted, QOfferAcceptedDate, QOfferDraft, CurrencyCode, rowguid)
		SELECT QOfferKey, QHeaderKey, VendorKey, QOfferComments, QOfferValue, QOfferDeliveryDate, QOfferCreatedByUserKey, QOfferCreatedDate, QOfferModifiedByUserKey, QOfferModifiedDate, QOfferAccepted, QOfferAcceptedDate, QOfferDraft, CurrencyCode, rowguid FROM dbo.QuoteOffers WITH (HOLDLOCK TABLOCKX)')
GO
SET IDENTITY_INSERT dbo.Tmp_QuoteOffers OFF
GO
ALTER TABLE dbo.QuoteOfferDetails
	DROP CONSTRAINT FK_QuoteOfferDetails_QuoteOffers
GO
DROP TABLE dbo.QuoteOffers
GO
EXECUTE sp_rename N'dbo.Tmp_QuoteOffers', N'QuoteOffers', 'OBJECT' 
GO
ALTER TABLE dbo.QuoteOffers ADD CONSTRAINT
	PK_QuoteOffers PRIMARY KEY CLUSTERED 
	(
	QOfferKey
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
ALTER TABLE dbo.QuoteOffers ADD CONSTRAINT
	FK_QuoteOffers_QuoteHeaders FOREIGN KEY
	(
	QHeaderKey
	) REFERENCES dbo.QuoteHeaders
	(
	QHeaderKey
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
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
ALTER TABLE dbo.QuoteOffers ADD CONSTRAINT
	FK_QuoteOffers_Currencies FOREIGN KEY
	(
	CurrencyCode
	) REFERENCES dbo.Currencies
	(
	CurrencyCode
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.QuoteOffers
	NOCHECK CONSTRAINT FK_QuoteOffers_Currencies
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.QuoteOfferDetails ADD CONSTRAINT
	FK_QuoteOfferDetails_QuoteOffers FOREIGN KEY
	(
	QOfferKey
	) REFERENCES dbo.QuoteOffers
	(
	QOfferKey
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.QuoteOfferDetails SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
