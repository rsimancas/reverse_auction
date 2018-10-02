Ext.define('Nuvem.model.Status', {
    extend: 'Ext.data.Model',
    idProperty: 'StatusId',
    autoLoad: false,

    fields: [
    { name:'StatusId', type:'int', defaultValue: null },
    { name:'StatusName', type:'string' },
    { name:'StatusOrder', type:'int', defaultValue: null },
    { name:'StatusCreatedBy', type:'string', defaultValue: Nuvem.GlobalSettings.getCurrentUserKey()},
    { name:'StatusCreatedDate', type:'date', defaultValue: null },
    { name:'StatusModifiedBy', type:'string', useNull: true, defaultValue: null },
    { name:'StatusModifiedDate', type:'date', useNull: true, defaultValue: null }
    ],

    proxy:{
        type:'rest',
        url: Nuvem.GlobalSettings.webApiPath + 'Status',
        headers: {
           'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'StatusId'
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