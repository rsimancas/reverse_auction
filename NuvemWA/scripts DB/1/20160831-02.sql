/*
   miércoles, 31 de agosto de 201607:12:02 p.m.
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
	DROP CONSTRAINT FK_Vendors_Cities
GO
ALTER TABLE dbo.Cities SET (LOCK_ESCALATION = TABLE)
GO
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
ALTER TABLE dbo.VendorShipAddress ADD
	CitiKey int NULL,
	StateKey int NULL
GO
ALTER TABLE dbo.VendorShipAddress ADD CONSTRAINT
	FK_VendorShipAddress_Cities FOREIGN KEY
	(
	CitiKey
	) REFERENCES dbo.Cities
	(
	CityKey
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.VendorShipAddress
	NOCHECK CONSTRAINT FK_VendorShipAddress_Cities
GO
ALTER TABLE dbo.VendorShipAddress ADD CONSTRAINT
	FK_VendorShipAddress_States FOREIGN KEY
	(
	StateKey
	) REFERENCES dbo.States
	(
	StateKey
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.VendorShipAddress
	NOCHECK CONSTRAINT FK_VendorShipAddress_States
GO
ALTER TABLE dbo.VendorShipAddress
	DROP COLUMN VendorShipCity, VendorShipState, VendorShipRegion
GO
ALTER TABLE dbo.VendorShipAddress SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
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
ALTER TABLE dbo.Vendors SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
