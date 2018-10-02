Ext.define('Nuvem.model.Sequences', {
    extend: 'Ext.data.Model',
    idProperty: 'SeqId',
    autoLoad: false,

    fields: [
    { name:'SeqId', type:'int', defaultValue: null },
    { name:'SeqName', type:'string' },
    { name:'SeqValue', type:'int', defaultValue: null },
    { name:'SeqPrefix', type:'string', useNull: true, defaultValue: null },
    { name:'SeqCreatedDate', type:'date', defaultValue: null },
    { name:'SeqCreatedBy', type:'string', defaultValue: Nuvem.GlobalSettings.getCurrentUserKey() },
    { name:'SeqModifiedDate', type:'date', useNull: true, defaultValue: null },
    { name:'SeqModifiedBy', type:'string', useNull: true, defaultValue: null }
    ],

    proxy:{
        type:'rest',
        url: Nuvem.GlobalSettings.webApiPath + 'Sequences',
        headers: {
           'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'SeqId'
        },
        afterRequest: function (request, success) {
            if (request.action == 'read') {
                //this.readCallback(request);
            }
            else if (request.action == 'create') {
                if (!request.operation.success)
                {
                    Ext.popupMsg.msg("Aviso", "O registo n&#227;o foi salvo com &#234;xito");
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    Ext.popupMsg.msg("Sucesso","Registro atualizado com &#234;xito");
                }
            }
            else if (request.action == 'update') {
                if (!request.operation.success)
                {
                    Ext.popupMsg.msg("Aviso", "O registo n&#227;o foi salvo com &#234;xito");
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    Ext.popupMsg.msg("Sucesso","Registro atualizado com &#234;xito");
                }
            }
            else if (request.action == 'destroy') {
                if (!request.operation.success)
                {
                    Ext.popupMsg.msg("Aviso", "O registo n&#227;o foi exclu&#237;do com &#234;xito");
                    //Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    Ext.popupMsg.msg("Sucesso","Registro exclu&#237;do com &#234;xito");
                }
            }
        }
    },


});