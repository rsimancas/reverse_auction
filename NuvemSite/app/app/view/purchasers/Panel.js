Ext.define('Nuvem.view.purchasers.Panel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.purchasersPanel',
    xtype: 'purchasers-panel',
    itemId: 'purchasersPanel',

    forceFit: true,

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },

    bodyPadding: '60 10 10 10',

    title: 'Painel de Controle',

    initComponent: function() {
        var me = this,
            commonHeight = 0.65;

        Ext.applyIf(me, {
            items: [
                // Panel Options
                {
                    xtype: 'container',
                    width: 680,
                    minWidth: 680,
                    layout: 'column',
                    items: [
                        // Users
                        {
                            xtype: 'container',
                            columnWidth: 0.5,
                            layout: 'fit',
                            items: [{
                                xtype: 'button',
                                glyph: 0xf0c0,
                                margin: '10 0 0 0',
                                border: false,
                                /*cls:'myButton',*/
                                ui: 'plain',
                                style: 'background-color:white!important; color:#3892d3 !important; font-size: 132px !important;',
                                iconAlign: 'center',
                                listeners: {
                                    click: {
                                        fn: me.onClickUsers,
                                        scope: me
                                    }
                                }
                            }, {
                                xtype: 'displayfield',
                                margin: '0 0 10 0',
                                value: 'Todos os usuários',
                                fieldStyle: 'font-size: 16px !important; font-weight: bold; text-align: center;'
                            }]
                        },
                        // Add User
                        {
                            xtype: 'container',
                            columnWidth: 0.5,
                            layout: 'fit',
                            items: [{
                                xtype: 'button',
                                margin: '10 0 0 0',
                                glyph: 0xf234,
                                border: false,
                                /*cls:'myButton',*/
                                ui: 'plain',
                                style: 'background-color:white!important; color:#3892d3 !important; font-size: 132px !important;',
                                iconAlign: 'center',
                                listeners: {
                                    click: {
                                        fn: me.onClickNewUser,
                                        scope: me
                                    }
                                }
                            }, {
                                xtype: 'displayfield',
                                margin: '0 0 10 0',
                                value: 'Novo Usuário',
                                fieldStyle: 'font-size: 16px !important; font-weight: bold; text-align: center;'
                            }]
                        },
                        // Informações do Usuário
                        {
                            xtype: 'container',
                            columnWidth: 0.5,
                            layout: 'fit',
                            items: [{
                                xtype: 'button',
                                margin: '10 0 0 0',
                                glyph: 0xf007,
                                border: false,
                                /*cls:'myButton',*/
                                ui: 'plain',
                                style: 'background-color:white!important; color:#3892d3 !important; font-size: 132px !important;',
                                iconAlign: 'center',
                                listeners: {
                                    click: {
                                        fn: me.onClickEditUser,
                                        scope: me
                                    }
                                }
                            }, {
                                xtype: 'displayfield',
                                margin: '0 0 10 0',
                                value: 'Informações do Usuário',
                                fieldStyle: 'font-size: 16px !important; font-weight: bold; text-align: center;'
                            }]
                        },
                        // Informações da Empresa
                        {
                            xtype: 'container',
                            columnWidth: 0.5,
                            layout: 'fit',
                            items: [{
                                xtype: 'button',
                                margin: '10 0 0 0',
                                columnWidth: 0.5,
                                glyph: 0xf013,
                                border: false,
                                /*cls:'myButton',*/
                                ui: 'plain',
                                style: 'background-color:white!important; color:#3892d3 !important; font-size: 132px !important;',
                                iconAlign: 'center',
                                listeners: {
                                    click: {
                                        fn: me.onClickInfo,
                                        scope: me
                                    }
                                }
                            }, {
                                xtype: 'displayfield',
                                margin: '0 0 10 0',
                                value: 'Informações da Empresa',
                                fieldStyle: 'font-size: 16px !important; font-weight: bold; text-align: center;'
                            }]
                        }
                    ]
                }
            ],
            // Form Listeners
            listeners: {
                afterrender: {
                    fn: me.onRenderForm,
                    scope: me
                }
            }
        });

        me.callParent(arguments);
    },

    onRenderForm: function() {
        var me = this;
    },

    onClickInfo: function() {
        var me = this,
            custKey = Nuvem.GlobalSettings.getCurrentUserCustKey(),
            vp = me.up('app_viewport');
            

        vp.getEl().mask("Aguarde...");

        var storeCustomers = new Nuvem.store.Customers().load({
            params: {
                id: custKey,
                page: 0,
                start: 0,
                limit: 0
            },
            callback: function(records, success, eOpts) {
                var record = records[0];

                var form = new Nuvem.view.purchasers.EditCustInfo({
                    currentRecord: record
                });
                form.loadRecord(record);
                form.callerForm = me;
                form.center();
                form.show();

                vp.getEl().unmask();

                this.lastOptions.callback = null;
            }
        });
    },

    onClickEditUser: function() {
        var me = this,
            custKey = Nuvem.GlobalSettings.getCurrentUserCustKey(),
            UserKey = Nuvem.GlobalSettings.getCurrentUserKey(),
            vp = me.up('app_viewport');
            

        vp.getEl().mask("Aguarde...");

        var storeUsers = new Nuvem.store.Users().load({
            params: {
                id: UserKey,
                page: 0,
                start: 0,
                limit: 0
            },
            callback: function(records, success, eOpts) {
                var record = records[0];

                var form = new Nuvem.view.purchasers.EditUserInfo({
                    currentRecord: record
                });
                form.loadRecord(record);
                form.callerForm = me;
                form.center();
                form.show();

                vp.getEl().unmask();

                this.lastOptions.callback = null;
            }
        });  
    },

    onClickUsers: function() {
        var me = this,
        custKey = Nuvem.GlobalSettings.getCurrentUserCustKey(),
        userKey = Nuvem.GlobalSettings.getCurrentUserKey();
        var vp = me.up('app_viewport');
            

        vp.getEl().mask("Aguarde...");

        var fieldFilters = JSON.stringify({
            fields: [
                { name: 'ParentUserKey', value: userKey, type: 'int' },
                { name: 'CustKey', value: custKey, type: 'int' }
            ]
        });

        var storeUsers = new Nuvem.store.Users().load({
            params: {
                fieldFilters: fieldFilters,
                page: 0,
                start: 0,
                limit: 0
            },
            callback: function(records, success, eOpts) {
                var form = new Nuvem.view.purchasers.UsersList({
                    storeUsers: storeUsers,
                    callerForm: me
                });

                vp.getEl().unmask();

                var panel = vp.down('#app_ContentPanel');

                panel.removeAll();
                panel.add(form);

                form.getEl().slideIn('r', {
                    easing: 'backOut',
                    duration: 1000,
                    listeners: {
                        afteranimate: function() {
                            form.down("#searchfield").focus(true, 200);
                            vp.getEl().unmask();
                        }
                    }
                });
            }
        });
    },

    onClickNewUser: function() {
        var me = this.up("form"),
            parentUserKey = Nuvem.GlobalSettings.getCurrentUserKey(),
            custKey = Nuvem.GlobalSettings.getCurrentUserCustKey();

        var record = Ext.create('Nuvem.model.Users', {
            ParentUserKey: parentUserKey,
            CustKey: custKey
        });

        var form = new Nuvem.view.purchasers.EditUserInfo({
            title: 'Novo Usuário',
            currentRecord: record
        });

        form.loadRecord(record);
        form.center();
        form.callerForm = this.up('form');
        form.show();
    }
});