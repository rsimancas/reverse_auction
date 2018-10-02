Ext.define('Nuvem.view.vendors.UsersList', {
    extend: 'Ext.form.Panel',
    alias: 'widget.vendorsUsersList',
    title: 'Users',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [{
                xtype: 'gridpanel',
                itemId: 'gridmain',
                scrollable: true,
                columnWidth: 1,
                viewConfig: {
                    stripeRows: true
                },
                minHeight: screen.height * 0.7,
                maxHeight: screen.height * 0.7,
                forceFit: true,
                store: me.storeUsers,
                columns: [{
                    xtype: 'numbercolumn',
                    sortable: true,
                    width: 60,
                    dataIndex: 'UserKey',
                    text: 'ID',
                    format: '000'
                }, {
                    xtype: 'gridcolumn',
                    flex: 1,
                    dataIndex: 'UserName',
                    text: 'Nome'
                }, {
                    xtype: 'gridcolumn',
                    flex: 1,
                    dataIndex: 'UserEmail',
                    text: 'E-mail'
                }, {
                    xtype: 'actioncolumn',
                    width: 30,
                    iconCls: 'app-grid-edit',
                    tooltip: 'edit',
                    listeners: {
                        click: {
                            fn: me.onClickEditLine,
                            scope: me
                        }
                    }
                }, {
                    xtype: 'actioncolumn',
                    width: 30,
                    items: [{
                        handler: me.onClickDeleteColumn,
                        scope: me,
                        iconCls: 'app-page-delete',
                        tooltip: 'Delete'
                    }]
                }],
                tbar: [{
                        xtype: 'searchfield',
                        width: '50%',
                        itemId: 'searchfield',
                        name: 'searchField',
                        listeners: {
                            'triggerclick': function(field) {
                                me.onSearchFieldChange();
                            }
                        }
                    }, {
                        xtype: 'component',
                        flex: 1
                    }, {
                        itemId: 'addline',
                        xtype: 'button',
                        text: 'Novo Usuário',
                        tooltip: 'Novo Usuário',
                        handler: function() {
                            var me = this.up("form"),
                                parentUserKey = Nuvem.GlobalSettings.getCurrentUserKey(),
                                VendorKey = Nuvem.GlobalSettings.getCurrentUserVendorKey();

                            var record = Ext.create('Nuvem.model.Users', {
                                ParentUserKey: parentUserKey,
                                VendorKey: VendorKey
                            });

                            var form = new Nuvem.view.vendors.EditUserInfo({
                                title: 'Novo Usuário',
                                currentRecord: record
                            });

                            form.loadRecord(record);
                            form.center();
                            form.callerForm = this.up('form');
                            form.show();
                        }
                    }
                    /*, {
                                        itemId: 'deleteline',
                                        text: 'Excluir',
                                        handler: function() {
                                            var grid = this.up('gridpanel');
                                            var sm = grid.getSelectionModel();

                                            selection = sm.getSelection();

                                            if (selection) {
                                                selection[0].destroy({
                                                    success: function() {
                                                        grid.store.reload({
                                                            callback: function() {
                                                                sm.select(0);
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        },
                                        disabled: true
                                    }*/
                ],
                selType: 'rowmodel',
                bbar: new Ext.PagingToolbar({
                    itemId: 'pagingtoolbar',
                    store: me.storeUsers,
                    displayInfo: true,
                    displayMsg: '{0} à {1} de {2} registro(s)',
                    emptyMsg: "Sem registros para exibir"
                }),
                listeners: {
                    validateedit: function(e) {
                        var myTargetRow = 6;

                        if (e.rowIdx == myTargetRow) {
                            e.cancel = true;
                            e.record.data[e.field] = e.value;
                        }
                    }
                }
            }],
            listeners: {
                render: {
                    fn: me.onRenderForm,
                    scope: me
                },
                afterrender: {
                    fn: me.registerKeyBindings,
                    scope: me
                },
            }

        });

        me.callParent(arguments);
    },

    onRenderForm: function() {
        var me = this;

        var grid = me.down('#gridmain');

        if (grid.getSelectionModel().selected.length === 0) {
            grid.getSelectionModel().select(0);
        }
    },

    registerKeyBindings: function(view, options) {
        var me = this;
        Ext.EventManager.on(view.getEl(), 'keyup', function(evt, t, o) {
                if (evt.keyCode === Ext.EventObject.INSERT) {
                    evt.stopEvent();
                    var btn = me.down('#addline');
                    btn.fireHandler();
                }
            },
            this);

        me.down('#searchfield').focus(true, 300);
    },

    onSearchFieldChange: function() {
        var form = this,
            field = form.down('#searchfield'),
            fieldValue = field.getRawValue(),
            grid = form.down('#gridmain');

        grid.store.removeAll();

        if (!String.isNullOrEmpty(fieldValue)) {
            grid.store.loadPage(1, {
                params: {
                    query: fieldValue
                },
                callback: function() {
                    form.down('#pagingtoolbar').bindStore(this);
                }
            });
        } else {
            grid.store.loadPage(1, {
                callback: function() {
                    form.down('#pagingtoolbar').bindStore(this);
                }
            });
        }
    },

    onClickEditLine: function(view, rowIndex, colIndex, item, e, record) {
        var me = this;
        var callerForm = view.panel.up('form');
        var selectedRecord = null;

        if (!Ext.isObject(record)) {
            var grid = callerForm.down('#gridmain');
            var sm = grid.getSelectionModel();
            selectedRecord = sm.lastSelected;
        } else {
            selectedRecord = record;
        }

        callerForm.up('app_viewport').getEl().mask('Please wait...');

        var form = new Nuvem.view.vendors.EditUserInfo({
            currentRecord: selectedRecord
        });
        form.loadRecord(selectedRecord);
        form.callerForm = callerForm;
        form.center();
        form.show();
        me.up('app_viewport').getEl().unmask();

    },

    onClickDeleteColumn: function(view, rowIndex, colIndex, item, e, record) {
        var me = this;

        Ext.Msg.show({
            title: 'Pergunta',
            msg: 'Você quer excluir o registro?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === "yes") {
                    record.destroy();
                }
            }
        });
    }
});