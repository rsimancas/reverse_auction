USE [Nuvem]
GO

/****** Object:  View [dbo].[vQuoteOffers]    Script Date: 05-04-2017 10:13:56 p.m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER VIEW [dbo].[vQuoteOffers]
AS
	SELECT  QO.*
		,V.VendorName as VendorName
		,CAST((CASE WHEN QO.QOfferStatus = 2 THEN 1 ELSE 0 END) AS BIT) as wasCancelled
	FROM dbo.QuoteOffers AS QO
	CROSS APPLY (SELECT VendorName FROM Vendors WHERE VendorKey = QO.VendorKey) as V

GO


