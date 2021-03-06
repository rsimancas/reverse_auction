USE [Nuvem]
GO
/****** Object:  StoredProcedure [dbo].[sp_AcceptOffer]    Script Date: 09-01-2017 03:06:50 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Rony Simancas
-- Create date: 07/01/2017
-- Description:	Accept Offer
-- =============================================
ALTER PROCEDURE [dbo].[sp_AcceptOffer]
	@QOfferKey int
	,@QHeaderKey int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @mensaje VARCHAR(MAX) = ''
	,@dateAccepted DATETIME = getdate();

    BEGIN TRY
		BEGIN TRANSACTION;

		DECLARE @VendorKey int
		,@QHeaderOC nvarchar(20)
		
		SELECT @QHeaderOC = QHeaderOC
		FROM vQuoteHeaders
		WHERE QHeaderKey = @QHeaderKey

		SELECT @VendorKey = VendorKey
		FROM vQuoteOffers
		WHERE QOfferKey = @QOfferKey 

		UPDATE QuoteOffers SET QOfferAccepted = 1, QOfferAcceptedDate = @dateAccepted
		WHERE QOfferKey = @QOfferKey

		UPDATE QuoteOffers SET QOfferAccepted = 0, QOfferAcceptedDate = @dateAccepted
		WHERE QHeaderKey = @QHeaderKey AND QOfferKey <> @QOfferKey

		UPDATE QuoteHeaders SET QHeaderStatus = 1
		WHERE QHeaderKey = @QHeaderKey

		DECLARE @Vendors TABLE(VendorKey int NOT NULL);

		WITH qData AS (
			SELECT a.VendorKey
                FROM vQuoteOffers a
                INNER JOIN Vendors b ON a.VendorKey = b.VendorKey
                LEFT OUTER JOIN Users c ON a.VendorKey = c.VendorKey
            WHERE QHeaderKey = @QHeaderKey
            UNION
            SELECT a.QMessageFromVendorKey as VendorKey
                FROM vQuoteMessages a 
                INNER JOIN Vendors b ON a.QMessageFromVendorKey = b.VendorKey
                LEFT OUTER JOIN Users c ON b.VendorKey = c.VendorKey
            WHERE QHeaderKey = @QHeaderKey
		)
		INSERT INTO @Vendors
		SELECT VendorKey
		FROM qData 
		GROUP BY VendorKey

		INSERT INTO Notifications (NotifyDescription, QHeaderKey, VendorKey, NotifyDate, NotifyRead)
		SELECT 'a proposta de outro fornecedor foi aceitada na ordem de compra #: ' + @QHeaderOC
		, @QHeaderKey, VendorKey, getdate(), 0
		FROM @Vendors
		WHERE VendorKey <> @VendorKey

		INSERT INTO Notifications (NotifyDescription, QHeaderKey, VendorKey, NotifyDate, NotifyRead)
		SELECT 'Parabéns, sua proposta foi aceitada na ordem de compra #: ' + @QHeaderOC
		, @QHeaderKey, VendorKey, getdate(), 0
		FROM @Vendors
		WHERE VendorKey = @VendorKey

		COMMIT TRANSACTION;
	END TRY

	BEGIN CATCH
		DECLARE @ErrorMessage NVARCHAR(4000);  
		DECLARE @ErrorSeverity INT;  
		DECLARE @ErrorState INT;  
  
		SELECT   
			@ErrorMessage = ERROR_MESSAGE(),  
			@ErrorSeverity = ERROR_SEVERITY(),  
			@ErrorState = ERROR_STATE();  
  
		-- Use RAISERROR inside the CATCH block to return error  
		-- information about the original error that caused  
		-- execution to jump to the CATCH block.  
		RAISERROR (@ErrorMessage, -- Message text.  
				   @ErrorSeverity, -- Severity.  
				   @ErrorState -- State.  
				   );  
	END CATCH;

	SELECT * 
	FROM vQuoteOffers 
	WHERE QOfferKey = @QOfferKey
END
