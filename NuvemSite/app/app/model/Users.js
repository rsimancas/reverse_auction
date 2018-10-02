Ext.define('Nuvem.model.Users', {
    extend: 'Ext.data.Model',

    fields: [
	    { name:'UserKey', type:'int', defaultValue: null },
		{ name:'UserEmail', type:'string' },
		{ name:'UserName', type:'string' },
		{ name:'UserPassword', type:'string' },
		{ name:'CustKey', type:'int', useNull: true, defaultValue: null },
		{ name:'VendorKey', type:'int', useNull: true, defaultValue: null },
		{ name:'UserCreatedByUserKey', type:'int', useNull: true, defaultValue: Nuvem.GlobalSettings.getCurrentUserKey() },
		{ name:'UserCreatedDate', type:'date', defaultValue: new Date() },
		{ name:'UserModifiedByUserKey', type:'int', useNull: true, defaultValue: null },
		{ name:'UserConfirmed', type:'boolean', defaultValue: null },
		{ name:'UserCPF', type:'string', useNull: true, defaultValue: null },
		{ name:'UserPhone', type:'string', useNull: true, defaultValue: null },
		{ name:'UserCell', type:'string', useNull: true, defaultValue: null },
		{ name:'ParentUserKey', type:'int', useNull: true, defaultValue: null },
		{ name:'UserPosition', type:'string', useNull: true, defaultValue: null },
		{ name:'VendorName', type:'string', useNull: true, defaultValue: null },
		{ name:'CustName', type:'string', useNull: true, defaultValue: null },
		{ name:'RoleKey', type:'int', defaultValue: null },
		{ name:'RoleName', type:'string' },
		{ name:'UserPasswordConfirm', type: 'string',
            convert: function(val,row) {
                return row.data.UserPassword;
            }   
        },
        { name:'UserFistLogon', type:'boolean', defaultValue: null }		
    ],

    proxy: {
        type: 'rest',
        url: Nuvem.GlobalSettings.webApiPath + 'Users',
        headers: {
            'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'UserKey'
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