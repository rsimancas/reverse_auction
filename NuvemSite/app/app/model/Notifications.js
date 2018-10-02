Ext.define('Nuvem.model.Notifications', {
    extend: 'Ext.data.Model',
    idProperty: 'NotifyKey',
    autoLoad: false,
    fields: [
        { name:'NotifyKey', type:'int', defaultValue: null },
        { name:'NotifyDescription', type:'string' },
        { name:'QHeaderKey', type:'int', useNull: true, defaultValue: null },
        { name:'CustKey', type:'int', useNull: true, defaultValue: null },
        { name:'VendorKey', type:'int', useNull: true, defaultValue: null },
        { name:'UserKey', type:'int', useNull: true, defaultValue: null },
        { name:'NotifyDate', type:'date', defaultValue: new Date() },
        { name:'NotifyDefinition', type:'string', useNull: true, defaultValue: null },
        { name:'NotifyArguments', type:'string', useNull: true, defaultValue: null },
        { name:'NotifyRead', type:'boolean', defaultValue: null },
        { name:'CustName', type:'string', useNull: true, defaultValue: null },
        { name:'VendorName', type:'string', useNull: true, defaultValue: null }
    ],
    proxy: {
        type: 'rest',
        url: Nuvem.GlobalSettings.webApiPath + 'Notifications',
        headers: {
            'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'NotifyKey'
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