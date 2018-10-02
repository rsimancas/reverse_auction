Ext.define('Nuvem.view.purchasers.EditUserInfo', {
    extend: 'Ext.form.Panel',
    alias: 'widget.purchasersEditUserInfo',
    modal: true,
    width: 500,
    layout: {
        type: 'absolute'
    },
    title: 'Informações do Usuário',
    bodyPadding: 10,
    closable: true,
    stateful: false,
    floating: true,
    callerForm: "",
    forceFit: true,
    currentRecord: null,
    glyph: 0xf007,
    oldPassword: null,

    initComponent: function() {

        var me = this;

        me.oldPassword = me.currentRecord.data.UserPassword;

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 60,
                msgTarget: 'side'
            },
            items: [{
                xtype: 'fieldcontainer',
                margin: '0 0 20 0',
                layout: {
                    type: 'column'
                },
                items: [
                    //Nome
                    {
                        xtype: 'textfield',
                        columnWidth: 1,
                        fieldLabel: 'Nome',
                        name: 'UserName',
                        allowBlank: false,
                        readOnly: me.currentRecord.phantom ? false : true
                    },
                    //Email
                    {
                        xtype: 'textfield',
                        columnWidth: 1,
                        margin: '0 0 0 0',
                        fieldLabel: 'E-mail',
                        name: 'UserEmail',
                        allowBlank: false,
                        readOnly: me.currentRecord.phantom ? false : true,
                    },
                    //CPF
                    {
                        xtype: 'textfield',
                        columnWidth: 1,
                        margin: '0 0 0 0',
                        fieldLabel: 'CPF',
                        name: 'UserCPF'
                    },
                    //Cargo
                    {
                        xtype: 'textfield',
                        columnWidth: 1,
                        margin: '0 0 0 0',
                        fieldLabel: 'Cargo',
                        name: 'UserPosition'
                    },
                    //Telefone
                    {
                        xtype: 'textfield',
                        columnWidth: 0.5,
                        fieldLabel: 'Telefone',
                        name: 'UserPhone'
                    },
                    //Celular
                    {
                        xtype: 'textfield',
                        columnWidth: 0.5,
                        margin: '0 0 0 5',
                        fieldLabel: 'Celular',
                        name: 'UserCell'
                    },
                    //Senha
                    {
                        xtype: 'textfield',
                        columnWidth: 1,
                        margin: '0 0 0 0',
                        fieldLabel: 'Senha',
                        name: 'UserPassword',
                        inputType: 'password',
                        allowBlank: false
                    },
                    //Confirme Senha
                    {
                        xtype: 'textfield',
                        columnWidth: 1,
                        margin: '0 0 0 0',
                        fieldLabel: 'Confirmar Senha',
                        name: 'UserPasswordConfirm',
                        inputType: 'password',
                        allowBlank: false
                    }
                ]
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: [{
                    xtype: 'component',
                    flex: 1
                }, {
                    xtype: 'button',
                    itemId: 'btnSave',
                    glyph: 0xf0c7,
                    width: 90,
                    text: 'Salvar',
                    listeners: {
                        click: {
                            fn: me.onSaveChanges,
                            scope: me
                        }
                    }
                }, {
                    xtype: 'button',
                    glyph: 0xf05e,
                    width: 90,
                    itemId: 'btnCancel',
                    text: 'Voltar',
                    listeners: {
                        click: {
                            fn: me.onClickCancel,
                            scope: me
                        }
                    }
                }]
            }],
            listeners: {
                render: {
                    fn: me.onRenderForm,
                    scope: me
                }
            }
        });

        me.callParent(arguments);
    },

    onRenderForm: function() {
        var me = this;
        if(!me.currentRecord.phantom)
            me.down("field[name=UserCPF]").focus(true, 200);
    },

    onSaveChanges: function(button, e, eOpts) {
        var me = this,
            oldPassword = me.oldPassword,
            form = me.getForm(),
            currentUserKey = Nuvem.GlobalSettings.getCurrentUserKey();

        if (!form.isValid()) {
            Ext.Msg.alert("Validação", "Verifique os dados!!!");
            return;
        }

        form.updateRecord();

        record = form.getRecord();

        if(record.data.UserPassword !== me.down("field[name=UserPasswordConfirm]").getValue()) {
            Ext.Msg.alert("Validação", "Senha e confirme não são os mesmos!!!");
            return;   
        }

        var IsPasswordChanged = oldPassword !== record.data.UserPassword;

        var cp = Ext.getCmp('app_ContentPanel');
        cp.getEl().mask("Aguarde...");

        record.save({
            callback: function(records, operation, success) {
                if (success) {
                    var form = me.callerForm;
                    
                    cp.getEl().unmask();

                    if(IsPasswordChanged && record.data.UserKey === currentUserKey) {
                        Ext.Msg.show({
                            title:'Aviso',
                            msg: 'Senha foi alterada, você deve reiniciar sessão',
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING,
                            fn: function() {
                                Ext.logoutApp();
                            }
                        });
                    }

                    if(Ext.isObject(form) && form.down("#gridmain")) {
                        form.down("#gridmain").store.reload();
                    }

                    me.destroy();


                } else {
                    cp.getEl().unmask();
                }
            }
        });
    },

    onClickCancel: function() {
        this.destroy();
    },

    onSelectState: function(field, records, eOpts) {
        var me = field.up('form');

        if (records.length === 0) return;

        var fieldCities = field.next();

        var fieldFilters = JSON.stringify({
            fields: [
                { name: 'StateKey', value: field.getValue(), type: 'string' }
            ]
        });

        me.getEl().mask('Carregando Cidades, Aguarde...');
        var storeCities = new Nuvem.store.Cities().load({
            params: {
                fieldFilters: fieldFilters,
                page: 0,
                start: 0,
                limit: 0
            },
            callback: function(records, success, eOpts) {
                fieldCities.bindStore(storeCities);
                me.getEl().unmask();
            }
        });

    }
});