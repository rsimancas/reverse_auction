USE [Nuvem]
GO

/****** Object:  View [dbo].[vCurrencyRates]    Script Date: 05-04-2017 09:24:37 p.m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[vCurrencyRates]
AS
SELECT        dbo.CurrencyRates.*, dbo.Currencies.CurrencyName
FROM            dbo.CurrencyRates INNER JOIN
                         dbo.Currencies ON dbo.CurrencyRates.CurrencyCode = dbo.Currencies.CurrencyCode

GO
