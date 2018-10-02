Ext.define('Nuvem.view.vendors.General', {
    extend: 'Ext.form.Panel',
    alias: 'widget.vendorsGeneral',
    xtype: 'vendorsGeneral',
    itemId: 'vendorsGeneral',

    layout: {
        type: 'column'
    },

    bodyPadding: 10,

    title: 'Visão Geral',

    initComponent: function() {
        var me = this,
            roleName = Nuvem.GlobalSettings.getCurrentUserRole(),
            commonHeight = 0.70;

        var firstDayOfYear = new Date((new Date()).getFullYear(), 0, 1);

        var vendorFilter = new Ext.util.Filter({
            property: 'VendorKey',
            value: Nuvem.GlobalSettings.getCurrentUserVendorKey()
        });

        var storeQuoteHeaders = new Nuvem.store.QuoteHeaders({
            autoLoad: false,
            remoteFilter: true,
            pageSize: Math.round(((screen.height * (70 / 100)) - 40) / 35),
            filters: [vendorFilter]
        });

        var storeQuoteDetail = null;

        var selModel = Ext.create('Ext.selection.CheckboxModel', {
            checkOnly: true,
            listeners: {
                select: function(model, record) {
                    record.set('x_Selected', true);
                },
                deselect: function(model, record) {
                    record.set('x_Selected', false);
                }
            }
        });

        var storeChart = new Nuvem.store.QuoteChart();

        Ext.applyIf(me, {
            items: [
                // Grid Visão Geral
                {
                    xtype: 'gridpanel',
                    itemId: 'gridMain',
                    title: 'Últimas Cotações',
                    autoScroll: false,
                    scrollable: false,
                    viewConfig: {
                        stripeRows: true
                    },
                    //title: 'Header',
                    columnWidth: 1,
                    minHeight: (screen.height * commonHeight).toFixed(0),
                    maxHeight: (screen.height * commonHeight).toFixed(0),
                    margin: '0 5 5 0',
                    store: storeQuoteHeaders,
                    columns: [{
                        xtype: 'rownumberer',
                        width: 40
                    }, {
                        xtype: 'gridcolumn',
                        flex: 1,
                        dataIndex: 'CustName',
                        text: 'Comprador',
                        renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                            var myToolTipText = "";
                            myToolTipText = myToolTipText + "<b>Data de Fechamento:</b> {0}".format(Ext.Date.format(record.get('QHeaderDateEnd'), 'd/m/Y'));
                            myToolTipText = myToolTipText + "<br/><b>IMPA:</b> {0}".format(record.get('QHeaderIMPA'));
                            myToolTipText = myToolTipText + "<br/><b>Categoría:</b> {0}".format(record.get('CategoryName'));

                            var numFianza = record.get('QHeaderNumFianza');
                            if (!String.isNullOrEmpty(numFianza))
                                myToolTipText = myToolTipText + "<br/><b># Fianza:</b> {0}".format(record.get('QHeaderNumFianza'));

                            metadata.tdAttr = 'data-qtip="' + myToolTipText + '"';
                            return value;
                        }
                    }, {
                        xtype: 'gridcolumn',
                        width: 130,
                        dataIndex: 'QHeaderOC',
                        text: 'Ordem de Compra'
                    }, {
                        xtype: 'gridcolumn',
                        width: 130,
                        dataIndex: 'QHeaderDateEnd',
                        text: 'Data de Expiração',
                        renderer: Ext.util.Format.dateRenderer('d/m/Y')
                    }, {
                        xtype: 'checkcolumn',
                        width: 80,
                        text: 'Finalizada',
                        dataIndex: 'isFinished',
                        columnHeaderCheckbox: false,
                        sortable: false,
                        hideable: false,
                        menuDisabled: true,
                        listeners: {
                            beforecheckchange: function(column, rowIndex, checked) {
                                // don't allow
                                return false;
                            }
                        }
                    }, {
                        xtype: 'checkcolumn',
                        width: 80,
                        text: 'Cancelada',
                        dataIndex: 'wasCancelled',
                        columnHeaderCheckbox: false,
                        sortable: false,
                        hideable: false,
                        menuDisabled: true,
                        listeners: {
                            beforecheckchange: function(column, rowIndex, checked) {
                                // don't allow
                                return false;
                            }
                        }
                    }, {
                        xtype: 'checkcolumn',
                        width: 80,
                        text: 'Desistida',
                        dataIndex: 'wasDesisted',
                        columnHeaderCheckbox: false,
                        sortable: false,
                        hideable: false,
                        menuDisabled: true,
                        listeners: {
                            beforecheckchange: function(column, rowIndex, checked) {
                                // don't allow
                                return false;
                            }
                        }
                    }, {
                        xtype: 'actioncolumn',
                        draggable: false,
                        width: 30,
                        resizable: false,
                        hideable: false,
                        stopSelection: false,
                        items: [{
                            itemId: 'actionMessages',
                            handler: function(grid, rowIndex, colIndex) {
                                var me = this.up('form');
                                var record = grid.getStore().getAt(rowIndex);
                                me.onClickMessages(record);
                            },
                            tooltip: 'Mensagens',
                            getGlyph: function(itemScope, rowIdx, colIdx, item, rec) {
                                return 'xf0e6@FontAwesome';
                            }
                        }]
                    }, {
                        xtype: 'actioncolumn',
                        width: 30,
                        draggable: false,
                        resizable: false,
                        hideable: false,
                        stopSelection: false,
                        items: [{
                            itemId: 'actionOffers',
                            handler: function(grid, rowIndex, colIndex) {
                                var me = this.up('form');
                                var record = grid.getStore().getAt(rowIndex);

                                me.onClickOffer(record);
                            },
                            tooltip: 'Orçamentos',
                            getGlyph: function(itemScope, rowIdx, colIdx, item, rec) {
                                return 'xf0d6@FontAwesome';
                            }
                        }]
                    }, {
                        xtype: 'actioncolumn',
                        width: 30,
                        items: [{
                            tooltip: 'Detalhe',
                            handler: function(grid, rowIndex, colIndex) {
                                var me = this.up('form');
                                var record = grid.getStore().getAt(rowIndex);
                                me.onClickViewDetail(record);
                            },
                            getGlyph: function(itemScope, rowIdx, colIdx, item, rec) {
                                return 'xf00e@FontAwesome';
                            }
                        }]
                    }],
                    selModel: selModel,
                    dockedItems: [
                        // Paging Toolbar
                        {
                            xtype: 'pagingtoolbar',
                            itemId: 'pagingtoolbar',
                            store: storeQuoteHeaders,
                            displayInfo: true,
                            dock: 'bottom',
                            displayMsg: 'Exibindo registros {0} - {1} de {2}',
                            emptyMsg: "Nenhum registro para mostrar",
                            listeners: {
                                change: function(pageTool, pageData, eOpts) {
                                    var me = this.up('form');
                                    me.RecalcTotals();
                                }
                            }
                        }
                    ],
                    tbar: [
                        // Search Field
                        {
                            xtype: 'searchfield',
                            width: 250,
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
                        }
                    ],
                    // Grid Quote Header Listeners
                    listeners: {
                        selectionchange: {
                            fn: me.onSelectChange,
                            scope: me
                        }
                    }
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
        me.onSearchFieldChange(true);
        //Extract the Input field
        var textEl = Ext.DomQuery.select('x-override-action', me.down('grid').getEl());
        //Add the custom class
        Ext.fly(textEl).addCls('padding-left45');
    },

    onSearchFieldChange: function(fromOnRenderForm) {
        var me = this,
            field = me.down('#searchfield'),
            fieldValue = field.getRawValue(),
            grid = me.down('#gridMain');

        grid.store.removeAll();

        if (!fromOnRenderForm) {
            chartA.getEl().mask('Carregando');
        }

        if (!String.isNullOrEmpty(fieldValue)) {
            grid.store.loadPage(1, {
                params: {
                    query: fieldValue
                }
            });

        } else {
            grid.store.loadPage(1, {
                callback: function() {
                    me.RecalcTotals();
                    this.lastOptions.callback = null;
                }
            });
        }
    },

    onClickMessages: function(record) {
        if (!Ext.isObject(record)) return;

        var callerForm = this;
        var form = new Nuvem.view.vendors.EditQuoteHeaderMessages({ currentRecord: record });
        form.callerForm = callerForm;
        form.center().show();
    },

    onSelectChange: function(model, records) {
        var me = this;
    },

    onClickViewDetail: function(record) {
        if (!Ext.isObject(record)) return;

        Ext.Router.redirect('!vendors/quote/{0}'.format(record.data.QHeaderKey));

        /*var me = this;
        var callerForm = this;
        var selectedRecord = record;
        var vp = me.up('app_viewport');

        me.getEl().mask('Carregando...');

        var storeQuoteHeaders = new Nuvem.store.QuoteHeaders().load({
            params: {
                id: selectedRecord.data.QHeaderKey
            },
            callback: function(records, success, eOpts) {
                var form = (records[0].data.QHeaderType === 0) ? new Nuvem.view.vendors.EditQuoteHeaderItem({
                    currentRecord: records[0],
                    title: 'Cotação Produto'
                }) : new Nuvem.view.vendors.EditQuoteHeaderService({
                    currentRecord: records[0],
                    title: 'Cotação Serviço'
                });

                form.loadRecord(records[0]);
                form.callerForm = callerForm;

                var panel = vp.down('#app_ContentPanel');

                me.hide();
                panel.add(form);

                form.getEl().slideIn('r', {
                    easing: 'backOut',
                    duration: 1000,
                    listeners: {
                        afteranimate: function() {
                            //formDetail.down("field[name=searchField]").focus(true, 200);
                        }
                    }
                });

                //Ext.Msg.hide();
                me.getEl().unmask();

                this.lastOptions.callback = null;
            }
        });*/
    },

    RecalcTotals: function(fromChecked) {
        var me = this,
            grid = me.down('#gridMain'),
            store = grid.store,
            totalInQuotes = 0,
            profitPct = 0,
            dateTo = new Date(),
            daysProm = 0;
    },

    onExportExcel: function() {
        var me = this,
            grid = me.down('#gridMain');

        Ext.Msg.wait('Carregando Report....', 'Aguarde');
        Ext.Ajax.request({
            url: '../wa/Reports/Export2Excel',
            method: 'GET',
            headers: {
                'Authorization-Token': Nuvem.GlobalSettings.tokenAuth
            },
            params: grid.store.lastOptions.params,
            success: function(response) {
                var text = response.responseText;
                //window.open('../wa/Reports/GetPDFReport?_file=' + text, 'Quote Customer','width='+screen.width+',height='+screen.height);
                window.open('../wa/Reports/GetExcel?_file=' + text, 'Quotes');
                Ext.Msg.hide();
            }
        });
    },

    onClickDeleteColumn: function(view, rowIndex, colIndex, item, e, record) {
        var me = this;

        var grid = me.down('gridpanel');

        Ext.Msg.show({
            title: 'Excluir',
            msg: 'Você deseja excluir?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === "yes") {
                    record.destroy();
                }
            }
        });
    },

    onClickOffer: function(record) {
        if (!Ext.isObject(record)) return;

        Ext.Router.redirect('!vendors/offer/{0}'.format(record.data.QHeaderKey));


        /*var me = this;
        var callerForm = this;
        var selectedRecord = record;
        var vp = me.up('app_viewport'),
            vendorKey = Nuvem.GlobalSettings.getCurrentUserVendorKey();

        me.getEl().mask('Carregando...');

        var storeQuoteOffers = new Nuvem.store.QuoteOffers().load({
            params: {
                fieldFilters: JSON.stringify({
                    fields: [
                        { name: 'QHeaderKey', type: 'int', value: record.data.QHeaderKey },
                        { name: 'VendorKey', type: 'int', value: vendorKey }
                    ]
                })
            },
            callback: function(records, success, eOpts) {
                var form = new Nuvem.view.vendors.EditQuoteHeaderOffers({
                    currentRecord: selectedRecord
                });
                form.callerForm = callerForm;
                var panel = vp.down('#app_ContentPanel');

                var model = null;

                if (records && records.length) {
                    model = records[0];
                } else {
                    model = new Nuvem.model.QuoteOffers({
                        QHeaderKey: record.data.QHeaderKey,
                        VendorKey: vendorKey
                    });
                }

                form.loadRecord(model);
                form.currentRecord = model;
                me.hide();
                panel.add(form);

                form.getEl().slideIn('r', {
                    easing: 'backOut',
                    duration: 1000,
                    listeners: {
                        afteranimate: function() {
                            //formDetail.down("field[name=searchField]").focus(true, 200);
                        }
                    }
                });

                me.getEl().unmask();

                this.lastOptions.callback = null;
            }
        });*/
        
    }
});
