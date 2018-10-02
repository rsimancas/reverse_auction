Ext.define('Nuvem.model.QuoteMessages', {
    extend: 'Ext.data.Model',
    idProperty: 'QMessageKey',
    autoLoad: false,
    fields: [
        { name:'QMessageKey', type:'int', defaultValue: null },
        { name:'QHeaderKey', type:'int', defaultValue: null },
        { name:'QMessageText', type:'string', useNull: true, defaultValue: null },
        { name:'QMessageFromVendorKey', type:'int', useNull: true, defaultValue: null },
        { name:'QMessageFromCustKey', type:'int', useNull: true, defaultValue: null },
        { name:'QMessageToVendorKey', type:'int', useNull: true, defaultValue: null },
        { name:'QMessageToCustKey', type:'int', useNull: true, defaultValue: null },
        { name:'QMessageDate', type:'date', defaultValue: null },
        { name:'QMessageRead', type:'boolean', defaultValue: null },
        { name:'QMessageCreatedByUserKey', type:'int', defaultValue: null },
        { name:'FromVendorName', type:'string', useNull: true, defaultValue: null },
        { name:'ToVendorName', type:'string', useNull: true, defaultValue: null },
        { name:'FromCustName', type:'string', useNull: true, defaultValue: null },
        { name:'ToCustName', type:'string', useNull: true, defaultValue: null }
    ],
    proxy: {
        type: 'rest',
        url: Nuvem.GlobalSettings.webApiPath + 'QuoteMessages',
        headers: {
            'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'QMessageKey'
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