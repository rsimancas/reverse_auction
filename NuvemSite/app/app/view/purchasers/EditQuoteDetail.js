Ext.define('Nuvem.view.purchasers.EditQuoteDetail', {
    extend: 'Ext.form.Panel',
    alias: 'widget.purchasers.EditQuoteDetail',
    //height: 185,
    modal: true,
    width: 500,
    layout: 'column',
    title: 'Produto',
    closable: true,
    //constrain: true,
    floating: true,
    callerForm: "",
    bodyPadding: 10,

    initComponent: function() {

        var me = this;

        var storeItems = new Nuvem.store.Items().load({
            params: {
                page: 1,
                start: 0,
                limit: 8
            }
        });

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 60,
                msgTarget: 'side'
            },
            items: [
                { 
                    xtype: 'fieldset',
                    layout: 'column',
                    items:[
                        // Quantidade
                        {
                            xtype: 'numericfield',
                            columnWidth: 0.2,
                            name: 'QHeaderQty',
                            fieldLabel: 'Quantidade',
                            fieldStyle: 'text-align: right;',
                            minValue: 1,
                            hideTrigger: false,
                            useThousandSeparator: true,
                            decimalPrecision: 0,
                            alwaysDisplayDecimals: true,
                            allowNegative: false,
                            alwaysDecimals: false,
                            thousandSeparator: ','
                        },
                        // Produto
                        {
                        	margin: '0 0 10 5',
                            xtype: 'fieldcontainer',
                            columnWidth: 0.8,
                            layout: 'hbox',
                            bodyPadding: 10,
                            items: [
                                // TextBox
                                {
                                    xtype: 'combo',
                                    fieldLabel: 'Produto',
                                    name: 'ItemKey',
                                    displayField: 'ItemName',
                                    valueField: 'ItemKey',
                                    queryMode: 'remote',
                                    pageSize: 8,
                                    minChars: 2,
                                    allowBlank: true,
                                    forceSelection: false,
                                    selectOnFocus: true,
                                    triggerAction: '',
                                    queryBy: 'ItemName',
                                    queryCaching: false,
                                    enableKeyEvents: true,
                                    emptyText: 'escolher produto',
                                    listeners: {
                                        buffer: 100,
                                        blur: {
                                            fn: me.onItemBlur,
                                            scope: me
                                        }
                                    },
                                    store: storeItems
                                },
                                // Adicionar Produto
                                {
                                    xtype: 'button',
                                    margin: '25 0 0 0',
                                    width: 25,
                                    glyph: 0xf067,
                                    itemId: 'btnAddItem',
                                    scale: 'medium',
                                    border: false,
                                    /*cls:'myButton',*/
                                    ui: 'plain',
                                    style: 'background-color:white!important; color:#3892d3 !important; font-size: 20px !important;',
                                    iconAlign: 'left',
                                    tooltip: 'Adicionar Produto',
                                    listeners: {
                                        click: {
                                            fn: me.onAddItem,
                                            scope: me
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: [{
                    xtype: 'component',
                    flex: 1
                }, {
                    xtype: 'button',
                    text: 'Salvar',
                    formBind: true,
                    listeners: {
                        click: {
                            fn: me.onSaveChanges,
                            scope: this
                        }
                    }
                }]
            }],
            listeners: {
                show: {
                    fn: me.onShowWindow,
                    scope: me
                }
            }
        });

        me.callParent(arguments);
    },

    onItemBlur: function(field) {
        var me = this,
            rawvalue = field.getRawValue(),
            records = field.displayTplData;

        if (records && records.length > 0) {
            me.down('field[name=QDetailPrice]').setValue(records[0].ItemPrice);
            me.down('field[name=x_VendorName]').setValue(records[0].x_VendorName);
            me.down('field[name=VendorId]').setValue(records[0].VendorId);
        }

        if (!String.isNullOrEmpty(rawvalue) && field.value === null) {
            Ext.Msg.show({
                title: 'Question',
                msg: 'The item doesn\'t exists, Do you want to add to database?',
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                fn: function(e) {
                    if (e === "yes") {
                        me.addItem(rawvalue);
                    } else {
                        field.setValue(null);
                        field.setRawValue('');
                        field.focus(true, 200);
                    }
                }
            });
        }
    },

    onShowWindow: function() {
        this.down('field[name=ItemKey]').focus(true, 200);
    },

    onSaveChanges: function(button, e, eOpts) {
        var me = this,
            form = me.getForm();

        if (!form.isValid()) {
            Ext.Msg.alert("Validation", "Check data for valid input!!!");
            return;
        }

        form.updateRecord();

        record = form.getRecord();

        var isPhantom = record.phantom;

        Ext.Msg.wait('Saving Record...', 'Wait');

        record.save({
            success: function(e) {
                Ext.Msg.hide();
                var form = me.callerForm,
                    grid = form.down('#gridQuoteDetails');

                if (!isPhantom) {
                    me.destroy();
                } else {
                    var newRecord = Ext.create('Nuvem.model.QuoteDetails', {
                        QHeaderId: record.data.QHeaderId
                    });
                    me.loadRecord(newRecord);
                    me.down('field[name=ItemKey]').focus(true, 200);
                }

                if (grid) {
                    grid.store.reload();
                }
            },
            failure: function() {
                Ext.Msg.hide();
            }
        });
    },

    onVendorBlur: function(field, The, eOpts) {
        if (field.readOnly) return;

        var me = field.up('panel'),
            rawvalue = field.getRawValue();

        if (field && field.valueModels !== null) {
            var filterVendor = new Ext.util.Filter({
                property: 'VendorId',
                value: field.value
            });
            var storeItems = new Nuvem.store.Items().load({
                params: {
                    page: 1,
                    start: 0,
                    limit: 8
                },
                filters: [filterVendor],
                callback: function() {
                    field.next().bindStore(storeItems);
                    field.next().filters = filterVendor;
                }
            });
        } else if (rawvalue !== null && rawvalue !== '') {
            Ext.Msg.show({
                title: 'Question',
                msg: 'The vendor doesn\'t exists, Do you want to add to database?',
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                fn: function(e) {
                    if (e === "yes") {
                        me.addVendor(rawvalue);
                    } else {
                        field.setValue(null);
                        field.focus(true, 200);
                    }
                }
            });
        }
    },

    addItem: function(rawvalue) {
        var me = this,
            record = Ext.create('Nuvem.model.Items', {
                ItemName: rawvalue
            });

        var formItem = new Nuvem.view.EditItem({
            title: 'New Item',
            calledFromQuotes: true
        });
        formItem.loadRecord(record);
        //form.center();
        formItem.callerForm = me;
        formItem.show();
        formItem.setX(me.getX() + 15);
        formItem.setY(me.getY() + 15);
        //me.hide();
    }
});
