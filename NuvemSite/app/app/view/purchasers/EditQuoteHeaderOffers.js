Ext.define('Nuvem.view.purchasers.EditQuoteHeaderOffers', {
    extend: 'Ext.form.Panel',
    alias: 'widget.purchasers.EditQuoteHeaderOffers',
    //modal: true,
    //width: 900,
    /*height: 580,*/
    layout: 'column',
    title: 'Orçamento',
    //closable: true,
    //floating: true,
    callerForm: null,
    currentRecord: null,
    bodyPadding: '10 0 10 0',
    activeCheckBox: null,
    currentAnswer: null,

    initComponent: function() {

        var me = this,
            vendorKey = Nuvem.GlobalSettings.getCurrentUserVendorKey();

        var qHeaderKey = (me.currentRecord) ? me.currentRecord.data.QHeaderKey : 0;

        var storeOfferDetails = null;

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 60,
                msgTarget: 'side'
            },
            items: [
                // Grid Offers
                {
                    margin: '10 10 10 10',
                    title: 'Produtos',
                    xtype: 'gridpanel',
                    itemId: 'gridOffers',
                    //store: storeOfferDetails,
                    columnWidth: 0.5,
                    minHeight: parseInt(screen.height * 0.20),
                    maxHeight: parseInt(screen.height * 0.20),
                    columns: [{
                        xtype: 'rownumberer',
                        width: 30
                    }, {
                        xtype: 'gridcolumn',
                        flex: 1,
                        dataIndex: 'VendorName',
                        text: 'Fornecedor'
                    }, {
                        xtype: 'gridcolumn',
                        width: 150,
                        text: 'Orçamento',
                        align: 'right',
                        dataIndex: 'QOfferValue',
                        renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                            var returnValue = Ext.util.Format.usMoney(value),
                                currencySymbol = 'R$ ';

                            //metadata.tdAttr = 'data-qtip="clique"';
                            return returnValue.replace('$', currencySymbol);
                        },
                        sortable: true,

                    }],
                    selType: 'rowmodel',
                    // Grid Quote Header Listeners
                    listeners: {
                        selectionchange: {
                            fn: me.onSelectChange,
                            scope: me
                        }
                    }
                },
                // Offer
                {
                    xtype: 'fieldset',
                    title: 'Detalhe',
                    margin: '0 10 15 10',
                    columnWidth: 0.5,
                    padding: 10,
                    layout: 'column',
                    items: [
                        // top line
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            columnWidth: 1,
                            items: [
                                // Data da Entrega
                                {
                                    xtype: 'datefield',
                                    fieldLabel: 'Data da Entrega',
                                    name: 'QOfferDeliveryDate',
                                    format: 'd/m/Y',
                                    value: new Date(),
                                    allowBlank: false,
                                    readOnly: true
                                }, {
                                    xtype: 'component',
                                    flex: 1
                                },
                                // Valor
                                {
                                    xtype: 'numericfield',
                                    name: 'QOfferValue',
                                    fieldLabel: 'Valor',
                                    minValue: 0,
                                    hideTrigger: true,
                                    allowBlank: false,
                                    useThousandSeparator: true,
                                    decimalPrecision: 2,
                                    alwaysDisplayDecimals: true,
                                    allowNegative: false,
                                    currencySymbol: 'R$ ',
                                    alwaysDecimals: false,
                                    thousandSeparator: ',',
                                    fieldStyle: 'text-align: right; color: green; font-weight: bold;',
                                    readOnly: true
                                },
                                // Offer Key
                                {
                                    xtype: 'hiddenfield',
                                    name: 'QOfferKey'
                                }
                            ]
                        },
                        // Comentarios
                        {
                            xtype: 'textareafield',
                            name: 'QOfferComments',
                            fieldLabel: 'Comentarios',
                            columnWidth: 1,
                            readOnly: true
                        },
                        // Grid Offer Details
                        {
                            margin: '10 10 10 10',
                            title: 'Produtos',
                            xtype: 'gridpanel',
                            itemId: 'gridOfferDetails',
                            store: storeOfferDetails,
                            columnWidth: 1,
                            minHeight: parseInt(screen.height * 0.20),
                            maxHeight: parseInt(screen.height * 0.20),
                            features: [{
                                ftype: 'summary'
                            }],
                            columns: [{
                                xtype: 'rownumberer',
                                width: 30
                            }, {
                                xtype: 'gridcolumn',
                                flex: 1,
                                dataIndex: 'ItemName',
                                text: 'Produto'
                            }, {
                                xtype: 'numbercolumn',
                                width: 90,
                                dataIndex: 'QOfferDetailQty',
                                text: 'Quantidade',
                                align: 'right',
                                renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                                    //metadata.tdAttr = 'data-qtip="clique"';
                                    return value;
                                }
                            }, {
                                xtype: 'gridcolumn',
                                width: 150,
                                text: 'Preço',
                                align: 'right',
                                dataIndex: 'QOfferDetailPrice',
                                renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                                    var returnValue = Ext.util.Format.usMoney(value),
                                        currencySymbol = 'R$ ';

                                    //metadata.tdAttr = 'data-qtip="clique"';
                                    return returnValue.replace('$', currencySymbol);
                                },
                                sortable: true,

                            }, {
                                xtype: 'gridcolumn',
                                width: 150,
                                text: 'Preço da Linha',
                                align: 'right',
                                dataIndex: 'QOfferDetailLinePrice',
                                renderer: function(value, metaData, record) {
                                    var returnValue = Ext.util.Format.usMoney(value),
                                        currencySymbol = 'R$ ';
                                    return returnValue.replace('$', currencySymbol);
                                },
                                summaryType: 'sum',
                                summaryRenderer: function(value, metaData, dataIndex) {
                                    var currencySymbol = "R$ ",
                                        returnValue = Ext.util.Format.usMoney(value);
                                    return returnValue.replace('$', currencySymbol);
                                },
                                sortable: true
                            }],
                            selType: 'rowmodel',
                        },
                        // Button
                        {
                            xtype: 'container',
                            columnWidth: 1,
                            layout: 'hbox',
                            items: [
                                // Component
                                {
                                    xtype: 'component',
                                    flex: 1
                                },
                                // Accept Offer Button
                                {
                                    xtype: 'button',
                                    text: 'Aceitar esta oferta',
                                    hidden: me.currentRecord.data.isFinished,
                                    handler: function() {
                                        var me = this.up('form');
                                        me.onAcceptOfferClick();
                                    }
                                }
                            ]
                        }
                    ]
                }
            ],
            dockedItems: [
                // ToolBar
                {
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
                        text: 'Enviar',
                        listeners: {
                            click: {
                                fn: me.onSaveChanges,
                                scope: me
                            }
                        },
                        hidden: true
                    }, {
                        xtype: 'button',
                        glyph: 0xf251,
                        width: 90,
                        itemId: 'btnSaveDraft',
                        text: 'Rascunho',
                        listeners: {
                            click: {
                                fn: me.onSaveChanges,
                                scope: me
                            }
                        },
                        hidden: true
                    }, {
                        xtype: 'button',
                        glyph: 0xf112,
                        width: 90,
                        itemId: 'btnCancel',
                        text: 'Voltar',
                        listeners: {
                            click: {
                                fn: me.onBackToQuotes,
                                scope: me
                            }
                        }
                    }]
                }
            ],
            listeners: {
                afterrender: {
                    fn: me.onShowWindow,
                    scope: me
                },
                close: {
                    fn: me.onCloseForm,
                    scope: me
                }
            }
        });

        me.callParent(arguments);
    },

    onShowWindow: function() {
        var me = this,
            grid = me.down('#gridOffers');

        if (grid.store.getCount() > 0) {
            grid.getSelectionModel().select(0);
        }

        //me.loadOfferDetails(me.currentRecord);
    },

    onSelectChange: function(model, records) {
        var me = this;
        me.loadRecord(records[0]);
        me.currentRecord = records[0];
        me.loadOfferDetails(records[0]);
    },

    onSaveChanges: function(button, e, eOpts) {
        var me = this,
            form = me.getForm();

        if (!form.isValid()) {
            Ext.Msg.alert("Validação", "Verifique os dados!!!");
            return;
        }

        form.updateRecord();

        var model = form.getRecord();

        var isPhantom = model.phantom;

        if (button.itemId === "btnSaveDraft") {
            model.data.QOfferDraft = true;
        } else {
            model.data.QOfferDraft = false;
        }

        me.getEl().mask('Guardar dados...');

        if (!model.data.QOfferDraft)
            model.getProxy().setSilentMode(true);

        model.save({
            success: function(record, operation) {
                me.saveItems(record);
            },
            failure: function() {
                me.getEl().unmask();
            }
        });
    },

    saveItems: function(savedRecord) {
        var me = this,
            grid = me.down("#gridOfferDetails"),
            store = grid.getStore();

        store.each(function(record) {
            record.getProxy().setSilentMode(true);
            record.set('QOfferKey', savedRecord.data.QOfferKey);
            record.set("QOfferDetailLinePrice", record.data.QOfferDetailQty * record.data.QOfferDetailPrice);
        });

        var toCreate = store.getNewRecords(),
            toUpdate = store.getUpdatedRecords(),
            toDestroy = store.getRemovedRecords(),
            needsSync = false;

        if (toCreate.length > 0 || toUpdate.length > 0 || toDestroy.length > 0) {
            needsSync = true;
        }

        if (needsSync) {
            store.sync({
                callback: function() {
                    me.getEl().unmask();
                    if (!savedRecord.data.QOfferDraft) {
                        Ext.Msg.show({
                            title: 'Nuvem B2B',
                            msg: 'Orçamento enviado corretamente',
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.INFO
                        });
                    }
                    me.onBackToQuotes();
                }
            });
        } else {
            me.getEl().unmask();
            if (!savedRecord.data.QOfferDraft) {
                Ext.Msg.show({
                    title: 'Nuvem B2B',
                    msg: 'Orçamento enviado corretamente',
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.INFO
                });
            }
            me.onBackToQuotes();
        }
    },

    loadOfferDetails: function(record) {
        var store = null,
            me = this,
            grid = me.down('#gridOfferDetails'),
            vendorKey = Nuvem.GlobalSettings.getCurrentUserVendorKey();

        me.getEl().mask("Carregando...");

        if (record.phantom) {
            storeItems = new Nuvem.store.QuoteDetails().load({
                params: {
                    fieldFilters: JSON.stringify({
                        fields: [
                            { name: 'QHeaderKey', type: 'int', value: record.data.QHeaderKey }
                        ]
                    })
                },
                callback: function(records, success, eOpts) {
                    if (records && records.length) {
                        store = new Nuvem.store.QuoteOfferDetails({ autoLoad: false });
                        Ext.Array.each(records, function(item, index) {
                            store.add(new Nuvem.model.QuoteOfferDetails({
                                ItemKey: item.data.ItemKey,
                                ItemName: item.data.ItemName,
                                QOfferDetailQty: item.data.QDetailQty
                            }));
                        });
                    }

                    grid.reconfigure(store);
                    me.getEl().unmask();
                    this.lastOptions.callback = null;
                }
            });
        } else {
            store = new Nuvem.store.QuoteOfferDetails().load({
                params: {
                    fieldFilters: JSON.stringify({
                        fields: [
                            { name: 'QOfferKey', type: 'int', value: record.data.QOfferKey }
                        ]
                    })
                },
                callback: function(records, success, eOpts) {
                    me.getEl().unmask();
                    grid.reconfigure(store);
                    this.lastOptions.callback = null;
                }
            });
        }
    },

    onBackToQuotes: function() {
        var me = this;
        var vp = me.up('app_viewport');
        var panel = vp.down('#app_ContentPanel');
        panel.remove(me);
        me.destroy();
        Ext.Router.redirect('!purchasers');
        
        /*var vp = this.up('app_viewport');
        var that = this;
        var formQuotes = that.callerForm;
        var panel = vp.down('#app_ContentPanel');
        var grid = formQuotes.down('#gridMain');

        formQuotes.down('#pagingtoolbar').doRefresh(function() {
            this.lastOptions.callback = null;
        });

        panel.remove(that);

        that.destroy();

        formQuotes.show();
        formQuotes.getEl().slideIn('l', {
            easing: 'backOut',
            duration: 1000
        });*/
    },

    onAcceptOfferClick: function() {
        var me = this,
            QOfferKey = me.down('field[name=QOfferKey]').getValue(),
            data = {
                QOfferKey: QOfferKey
            };

        me.getEl().mask("Enviando...");

        Ext.Ajax.request({
            method: 'POST',
            url: Nuvem.GlobalSettings.webApiPath + 'AcceptOffer',
            headers: {
                'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
            },
            jsonData: data,
            success: function(data) {
                me.getEl().unmask();
                //Ext.popupMsg.msg("Sucesso", "A oferta foi aceitada com &#234;xito");

                Ext.Msg.show({
                    title: 'Sucesso',
                    msg: 'A oferta foi aceitada com &#234;xito',
                    width: 300,
                    buttons: Ext.Msg.OK,
                    fn: function() {
                        me.onBackToQuotes();
                    },
                    icon: Ext.Msg.INFO
                });
                
            },
            failure: function() {
                me.getEl().unmask();
                //Ext.popupMsg.msg("Aviso", "A oferta n&#227;o foi aceitada com &#234;xito");
                Ext.Msg.show({
                    title: 'Aviso',
                    msg: 'A oferta n&#227;o foi aceitada com &#234;xito',
                    width: 300,
                    buttons: Ext.Msg.OK,
                    fn: function() {
                        //me.onBackToQuotes();
                    },
                    icon: Ext.Msg.ERROR
                });
            }
        });
    }
});
