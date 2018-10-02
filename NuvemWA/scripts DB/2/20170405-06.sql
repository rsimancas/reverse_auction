USE [Nuvem]
GO

/****** Object:  View [dbo].[vQuoteHeaders]    Script Date: 05-04-2017 09:54:26 p.m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO







ALTER VIEW [dbo].[vQuoteHeaders]
AS
	SELECT  a.*, c.CustName, d.CategoryName
		,CAST((CASE WHEN a.QHeaderStatus = 1 OR a.QHeaderStatus = 2 THEN 1 ELSE 0 END) AS BIT) as isFinished
		,ISNULL(QDT.Items, 0) as TotalItems
	FROM dbo.QuoteHeaders AS a INNER JOIN
	 dbo.Customers AS c ON a.CustKey = c.CustKey INNER JOIN
	 dbo.Categories AS d ON d.CategoryKey = a.CategoryKey
	 OUTER APPLY (SELECT COUNT(*) as Items FROM dbo.QuoteDetails QD WHERE a.QHeaderKey = QD.QHeaderKey) as QDT


GO


