USE [Nuvem]
GO

/****** Object:  View [dbo].[vQuoteOffers]    Script Date: 05-04-2017 11:17:29 p.m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




ALTER VIEW [dbo].[vQuoteOffers]
AS
	SELECT  QO.*
		,V.VendorName as VendorName
		,CAST((CASE WHEN QO.QOfferStatus = 2 THEN 1 ELSE 0 END) AS BIT) as wasDesisted
		,CAST((CASE WHEN QH.QHeaderStatus = 1 OR QH.QHeaderStatus = 2 THEN 1 ELSE 0 END) AS BIT) as isFinished
	FROM dbo.QuoteOffers AS QO
	LEFT OUTER JOIN Vendors V ON V.VendorKey = QO.VendorKey
	LEFT OUTER JOIN dbo.QuoteHeaders QH ON QH.QHeaderKey = QO.QHeaderKey



GO


