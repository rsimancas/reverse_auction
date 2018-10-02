USE [Nuvem]
GO

/****** Object:  View [dbo].[vVendors]    Script Date: 25-03-2017 08:59:30 p.m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[vVendors]
AS
SELECT  v.*
    , c.CityName
	, s.StateName
FROM dbo.Vendors v
	LEFT OUTER JOIN dbo.Cities c ON v.CitiKey = c.CityKey
	LEFT OUTER JOIN dbo.States s ON v.StateKey = s.StateKey

GO


