USE [Nuvem]
GO

/****** Object:  View [dbo].[vCurrencies]    Script Date: 05-04-2017 09:23:39 p.m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[vCurrencies]
AS
SELECT        dbo.Currencies.*
FROM            dbo.Currencies

GO


