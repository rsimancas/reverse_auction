Ext.define('Nuvem.model.Interested', {
    extend: 'Ext.data.Model',
    autoLoad: false,
    fields: [
        { name:'QHeaderKey', type:'int', defaultValue: null },
        { name:'InterestedVendorKey', type:'int', useNull: true, defaultValue: null },
        { name:'InterestedVendorName', type:'string', useNull: true, defaultValue: null },
        { name:'InterestedVendorEmail', type:'string', useNull: true, defaultValue: null },
        { name:'InterestedVendorMessages', type:'int', useNull: true, defaultValue: null },
        { name:'InterestedLastMessage', type:'string', useNull: true, defaultValue: null },
        { name:'InterestedLastMessageDate', type:'date', useNull: true, defaultValue: null }
    ],
    proxy: {
        type: 'rest',
        url: Nuvem.GlobalSettings.webApiPath + 'Interested',
        headers: {
            'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message'
        },
        afterRequest: function(request, success) {
            if (request.action == 'read') {
                //this.readCallback(request);
            } else if (request.action == 'create') {
                if (!request.operation.success) {
                    Ext.popupMsg.msg("Aviso", "O registo n&#227;o foi salvo com &#234;xito");
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    Ext.popupMsg.msg("Sucesso", "Registro atualizado com &#234;xito");
                }
            } else if (request.action == 'update') {
                if (!request.operation.success) {
                    Ext.popupMsg.msg("Aviso", "O registo n&#227;o foi salvo com &#234;xito");
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    Ext.popupMsg.msg("Sucesso", "Registro atualizado com &#234;xito");
                }
            } else if (request.action == 'destroy') {
                if (!request.operation.success) {
                    Ext.popupMsg.msg("Aviso", "O registo n&#227;o foi exclu&#237;do com &#234;xito");
                } else {
                    Ext.popupMsg.msg("Sucesso", "Registro exclu&#237;do com &#234;xito");
                }
            }
        }
    }
});