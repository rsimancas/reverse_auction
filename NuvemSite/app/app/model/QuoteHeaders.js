Ext.define('Nuvem.model.QuoteHeaders', {
    extend: 'Ext.data.Model',
    idProperty: 'QHeaderKey',
    autoLoad: false,

    fields: [
        { name: 'QHeaderKey', type: 'int', defaultValue: null },
        { name: 'QHeaderDateBegin', type: 'date', useNull: true, defaultValue: null },
        { name: 'QHeaderDateEnd', type: 'date', useNull: true, defaultValue: null },
        { name: 'QHeaderIMPA', type: 'string', useNull: true, defaultValue: null },
        { name: 'QHeaderCEP_R', type: 'string', useNull: true, defaultValue: null },
        { name: 'QHeaderCEP_E', type: 'string', useNull: true, defaultValue: null },
        { name: 'CustKey', type: 'int', defaultValue: null },
        { name: 'CustShipKey', type: 'int', useNull: true, defaultValue: null },
        { name: 'QHeaderDateRequired', type: 'date', useNull: true, defaultValue: null },
        { name: 'QHeaderBrasil', type: 'boolean', useNull: true, defaultValue: null },
        { name: 'QHeaderSudeste', type: 'boolean', useNull: true, defaultValue: null },
        { name: 'QHeaderSul', type: 'boolean', useNull: true, defaultValue: null },
        { name: 'QHeaderNordeste', type: 'boolean', useNull: true, defaultValue: null },
        { name: 'QHeaderNorte', type: 'boolean', useNull: true, defaultValue: null },
        { name: 'QHeaderCentroOeste', type: 'boolean', useNull: true, defaultValue: null },
        { name: 'QHeaderOC', type: 'string', useNull: true, defaultValue: null },
        { name: 'QHeaderOCDate', type: 'date', useNull: true, defaultValue: null },
        { name: 'QHeaderCreatedByUserKey', type: 'int', defaultValue: Nuvem.GlobalSettings.getCurrentUserKey() },
        { name: 'QHeaderCreatedDate', type: 'date', defaultValue: new Date() },
        { name: 'QHeaderModifiedByUserKey', type: 'int', useNull: true, defaultValue: null },
        { name: 'QHeaderModifiedDate', type: 'date', useNull: true, defaultValue: null },
        { name: 'QHeaderEstimatedDate', type: 'date', useNull: true, defaultValue: null },
        { name: 'QHeaderComments', type: 'string', useNull: true, defaultValue: null },
        { name: 'QHeaderDraft', type: 'boolean', defaultValue: null },
        { name: 'QHeaderType', type: 'int', defaultValue: null },
        { name: 'QHeaderStatus', type: 'int', defaultValue: 0 },
        { name: 'CategoryKey', type: 'int', useNull: true, defaultValue: null },
        { name: 'CustName', type: 'string' },
        { name: 'CategoryName', type: 'string' },
        { name: 'Interested', type: 'int', defaultValue: 0 },
        { name: 'Offers', type: 'int', defaultValue: 0 },
        { name: 'isFinished', type: 'boolean', defaultValue: false },
        { name: 'TotalItems', type: 'int', defaultValue: 0 },
        { name: 'wasCancelled', type: 'boolean', defaultValue: false },
        { name: 'wasDesisted', type: 'boolean', defaultValue: false }
    ],

    proxy: {
        type: 'rest',
        url: Nuvem.GlobalSettings.webApiPath + 'QuoteHeaders',
        headers: {
            'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'QHeaderKey'
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
