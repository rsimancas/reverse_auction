Ext.define('Nuvem.view.BrokersList', {
    extend: 'Ext.form.Panel',
    alias: 'widget.brokerslist',
    title: 'Brokers',

    initComponent: function() {
        var me = this;

        var storeBrokers = new Nuvem.store.Brokers().load();

        rowEditing = new Ext.grid.plugin.RowEditing({
            clicksToMoveEditor: 2,
            autoCancel: false,
            errorSummary: false,
            listeners: {
                beforeedit: {
                    delay: 100,
                    fn: function(item, e) {
                        this.getEditor().onFieldChange();
                    }
                },
                cancelEdit: {
                    fn: function(rowEditing, context) {
                        var grid = this.editor.up("gridpanel");
                        // Canceling editing of a locally added, unsaved record: remove it
                        if (context.record.phantom) {
                            grid.store.remove(context.record);
                            grid.up('panel').down('#searchfield').focus(true, 200);
                        }
                    }
                },
                edit: {
                    fn: function(editor, context) {
                        var grid = this.editor.up('gridpanel'),
                            record = context.record,
                            fromEdit = true,
                            isPhantom = record.phantom;
                        //console.log(this.editor.form.isValid());

                        record.save({
                            callback: function() {
                                grid.store.reload({
                                    callback: function() {
                                        if (fromEdit && isPhantom)
                                            grid.up('panel').down("#addline").fireHandler();
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });

        Ext.applyIf(me, {
            items: [{
                xtype: 'gridpanel',
                itemId: 'gridmain',
                autoScroll: true,
                columnWidth: 1,
                viewConfig: {
                    stripeRows: true
                },
                minHeight: 450,
                forceFit: true,
                store: storeBrokers,
                columns: [{
                    xtype: 'numbercolumn',
                    sortable: true,
                    width: 100,
                    dataIndex: 'BrokerId',
                    text: 'ID',
                    format: '000'
                }, {
                    xtype: 'gridcolumn',
                    flex: 1,
                    dataIndex: 'BrokerName',
                    text: 'Name',
                    editor: {
                        xtype: 'textfield',
                        name: 'BrokerName',
                        fieldStyle: 'text-transform:uppercase',
                        allowBlank: false,
                        listeners: {
                            change: function(field, newValue, oldValue) {
                                var form = field.up('panel');
                                form.onFieldChange();

                                if (!String.isNullOrEmpty(newValue)) field.setValue(newValue.toUpperCase());
                            }
                        }
                    }
                }, {
                    xtype: 'numbercolumn',
                    sortable: true,
                    width: 120,
                    dataIndex: 'BrokerRoyaltyPct',
                    text: 'Royalty',
                    format: '000,00',
                    editor: {
                        xtype: 'numericfield',
                        name: 'BrokerRoyaltyPct',
                        minValue: 0,
                        hideTrigger: true,
                        allowBlank: true,
                        useThousandSeparator: true,
                        decimalPrecision: 2,
                        alwaysDisplayDecimals: true,
                        allowNegative: false,
                        alwaysDecimals: false,
                        thousandSeparator: ',',
                        fieldStyle: 'text-align: right;',
                        enableKeyEvents: true
                    }
                }, {
                    xtype: 'actioncolumn',
                    width: 35,
                    items: [{
                        handler: me.onClickActionColumn,
                        iconCls: 'app-grid-edit',
                        //iconCls: 'x-form-search-trigger',
                        tooltip: 'Edit'
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
                    text: 'Add',
                    tooltip: 'Add (Ins)',
                    handler: function() {
                        rowEditing.cancelEdit();

                        var grid = this.up("gridpanel");

                        var count = grid.store.getCount();

                        // Create a model instance
                        var r = Ext.create('Nuvem.model.Brokers');

                        grid.store.insert(count, r);
                        rowEditing.startEdit(r, 1);
                        rowEditing.editor.down('field[name=SecNombre]').focus(true, 200);
                    }
                }, {
                    itemId: 'deleteline',
                    text: 'Excluir',
                    handler: function() {
                        var grid = this.up('gridpanel');
                        var sm = grid.getSelectionModel();

                        rowEditing.cancelEdit();

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
                }],
                selType: 'rowmodel',
                plugins: [rowEditing],
                bbar: new Ext.PagingToolbar({
                    itemId: 'pagingtoolbar',
                    store: storeBrokers,
                    displayInfo: true,
                    displayMsg: '{0} � {1} de {2} registro(s)',
                    emptyMsg: "Sem registros para exibir"
                }),
                listeners: {
                    selectionchange: function(view, records) {
                        this.down('#deleteline').setDisabled(!records.length);
                    },
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
                    //console.log(btn); //.click();
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

    onClickActionColumn: function(view, rowIndex, colIndex, item, e, record) {
        var me = this.up('panel').up('panel');

        rowEditing.startEdit(record, 1);
        this.up('panel').editingPlugin.editor.down('field[name=SecNombre]').focus(true, 200);
    }

});
