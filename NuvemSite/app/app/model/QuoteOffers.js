Ext.define('Nuvem.model.QuoteOffers', {
    extend: 'Ext.data.Model',
    idProperty: 'QOfferKey',
    autoLoad: false,
    fields: [
        { name:'QOfferKey', type:'int', defaultValue: null },
        { name:'QHeaderKey', type:'int', defaultValue: null },
        { name:'VendorKey', type:'int', defaultValue: null },
        { name:'QOfferComments', type:'string', useNull: true, defaultValue: null },
        { name:'QOfferValue', type:'float', defaultValue: null },
        { name:'QOfferDeliveryDate', type:'date', defaultValue: new Date() },
        { name:'QOfferCreatedByUserKey', type:'int', defaultValue: Nuvem.GlobalSettings.getCurrentUserKey() },
        { name:'QOfferCreatedDate', type:'date', defaultValue: new Date() },
        { name:'QOfferModifiedByUserKey', type:'int', defaultValue: null },
        { name:'QOfferModifiedDate', type:'date', defaultValue: null },
        { name:'QOfferAccepted', type:'int', defaultValue: 0 },
        { name:'QOfferAcceptedDate', type:'date', useNull: true, defaultValue: null },
        { name:'QOfferDraft', type:'boolean', defaultValue: true },
        { name:'CurrencyCode', type:'string', useNull: true, defaultValue: null },
        { name:'QOfferStatus', type:'int', defaultValue: 0 },
        { name:'VendorName', type:'string' },
        { name:'wasDesisted', type:'boolean', defaultValue: false },
        { name: 'isFinished', type: 'boolean', defaultValue: false }
    ],
    proxy: {
        type: 'rest',
        url: Nuvem.GlobalSettings.webApiPath + 'QuoteOffers',
        headers: {
            'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'QOfferKey'
        },
        afterRequest: function(request, success) {
            var silentMode = this.getSilentMode();

            if (request.action == 'read') {
                //this.readCallback(request);
            } else if (request.action == 'create') {
                if (!request.operation.success) {
                    Ext.popupMsg.msg("Aviso", "O registo n&#227;o foi salvo com &#234;xito");
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    if (!silentMode)
                        Ext.popupMsg.msg("Sucesso", "Registro atualizado com &#234;xito");
                }
            } else if (request.action == 'update') {
                if (!request.operation.success) {
                    Ext.popupMsg.msg("Aviso", "O registo n&#227;o foi salvo com &#234;xito");
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    if (!silentMode)
                        Ext.popupMsg.msg("Sucesso", "Registro atualizado com &#234;xito");
                }
            } else if (request.action == 'destroy') {
                if (!request.operation.success) {
                    Ext.popupMsg.msg("Aviso", "O registo n&#227;o foi exclu&#237;do com &#234;xito");
                } else {
                    if (!silentMode)
                        Ext.popupMsg.msg("Sucesso", "Registro exclu&#237;do com &#234;xito");
                }
            }

            this.setSilentMode(false);
        }
    }
});