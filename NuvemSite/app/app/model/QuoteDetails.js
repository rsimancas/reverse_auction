Ext.define('Nuvem.model.QuoteDetails', {
    extend: 'Ext.data.Model',
    idProperty: 'QDetailKey',
    autoLoad: false,
    fields: [
        { name:'QDetailKey', type:'int', defaultValue: null },
        { name:'QHeaderKey', type:'int', defaultValue: null },
        { name:'ItemKey', type:'int', useNull: true, defaultValue: null },
        { name:'QDetailQty', type:'numeric', defaultValue: null },
        { name:'QDetailCreatedByUserKey', type:'int', defaultValue: Nuvem.GlobalSettings.getCurrentUserKey() },
        { name:'QDetailCreatedDate', type:'date', defaultValue: new Date() },
        { name:'QDetailModifiedByUserKey', type:'int', useNull: true, defaultValue: null },
        { name:'QDetailModifiedDate', type:'date', useNull: true, defaultValue: null },
        { name:'ItemName', type:'string' },
        { name:'ItemIMPA', type:'string' },
        { name:'ItemNCM', type:'string' }
    ],
    proxy: {
        type: 'rest',
        url: Nuvem.GlobalSettings.webApiPath + 'QuoteDetails',
        headers: {
            'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'QDetailKey'
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