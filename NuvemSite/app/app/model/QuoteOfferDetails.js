Ext.define('Nuvem.model.QuoteOfferDetails', {
    extend: 'Ext.data.Model',
    idProperty: 'QOfferDetailKey',
    autoLoad: false,
    fields: [
        { name: 'QOfferDetailKey', type: 'int', defaultValue: null },
        { name: 'QOfferKey', type: 'int', defaultValue: null },
        { name: 'ItemKey', type: 'int', defaultValue: null },
        { name: 'QOfferDetailQty', type: 'float', defaultValue: null },
        { name: 'QOfferDetailPrice', type: 'float', defaultValue: null },
        { name: 'QOfferDetailLinePrice', type: 'float', defaultValue: null },
        { name: 'QOfferDetailAccepted', type:'int', defaultValue: 0 },
        { name: 'QOfferDetailAcceptedDate', type:'date', useNull: true, defaultValue: null },
        { name: 'ItemName', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: Nuvem.GlobalSettings.webApiPath + 'QuoteOfferDetails',
        headers: {
            'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'QOfferDetailKey'
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