Ext.define('Nuvem.view.purchasers.EditItem', {
    extend: 'Ext.form.Panel',
    alias: 'widget.purchasers.EditItem',
    modal: true,
    width: parseInt(screen.width * 0.5),
    layout: 'column',
    title: 'Produto',
    closable: true,
    //constrain: true,
    formBind: true,
    floating: true,
    callerForm: "",
    calledFromQuotes: false,
    currentRecord: null,
    bodyPadding: 10,
    ItemType: 0,

    initComponent: function() {

        var me = this;

        Ext.applyIf(me, {
            minHeight:  me.ItemType === 1 ? 100 : 250,
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 60,
                msgTarget: 'side',
            },
            items: [
                // Part #
                {
                    xtype: 'textfield',
                    columnWidth: 1,
                    name: 'ItemPartNumber',
                    fieldLabel: 'Part #',
                    allowBlank: true,
                    hidden: me.ItemType === 1
                },
                // Nome do Produto / Serviço
                {
                    xtype: 'textfield',
                    fieldLabel: 'Nome do ' + ((me.ItemType === 1) ? 'Serviço' : 'Produto'),
                    columnWidth: 1,
                    name: 'ItemName',
                    allowBlank: false
                },
                // Fabricante
                {
                    xtype: 'textfield',
                    fieldLabel: 'Fabricante',
                    columnWidth: 1,
                    name: 'ItemBrand',
                    allowBlank: me.ItemType === 0,
                    hidden: me.ItemType === 1
                },
                // Observação
                {
                    xtype: 'textfield',
                    fieldLabel: 'Observação',
                    columnWidth: 1,
                    name: 'ItemDescription',
                    allowBlank: true,
                    hidden: me.ItemType === 1
                },
                // IMPA
                {
                    xtype: 'textfield',
                    fieldLabel: 'Código IMPA',
                    columnWidth: 0.5,
                    name: 'ItemIMPA',
                    allowBlank: true,
                    hidden: me.ItemType === 1
                },
                // NCM
                {
                    xtype: 'textfield',
                    margin: '0 0 0 5',
                    fieldLabel: 'Código NCM',
                    columnWidth: 0.5,
                    name: 'ItemNCM',
                    allowBlank: true,
                    hidden: me.ItemType === 1
                }
            ],
            dockedItems: [
                // Toolbar
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    ui: 'footer',
                    items: [{
                        xtype: 'component',
                        flex: 1
                    }, {
                        xtype: 'button',
                        text: 'Salvar ',
                        formBind: true,
                        listeners: {
                            click: {
                                fn: me.onSaveChanges,
                                scope: me
                            }
                        }
                    }]
                }
            ],
            listeners: {
                show: {
                    fn: me.onShowWindow,
                    scope: me
                }
            }
        });

        me.callParent(arguments);
    },

    onShowWindow: function() {
        var me = this;

        if(me.ItemType === 0) {
            this.down('field[name=ItemPartNumber]').focus(true, 200);
        } else {
            this.down('field[name=ItemName]').focus(true, 200);
        }
    },

    onSaveChanges: function(button, e, eOpts) {
        var me = this,
            form = me.getForm();

        if (!form.isValid()) {
            Ext.Msg.alert("Validação", "Verifique se há dados de entrada válidos !!!");
            return;
        }

        form.updateRecord();

        var record = form.getRecord();

        var isPhantom = record.phantom;

        Ext.Msg.wait("Guardar dados...", "Aguarde");

        record.save({
            success: function(e) {
                //me.getEl.unmask();
                var callerForm = me.callerForm,
                    gridpanel = callerForm.down("gridpanel");

                if(gridpanel) {
                    var pluginEditing = gridpanel.plugins[0],
                        editor = pluginEditing.editor,
                        field = editor.down("field[name=ItemKey]");

                    var params = field.store.lastOptions.params;
                    params.id = record.data.ItemKey;
                    field.store.load({
                        params: params,
                        callback: function() {
                            field.setValue(record.data.ItemKey);
                            field.focus(true, 500);
                            var contextRecord = pluginEditing.context.record;

                            contextRecord.set('ItemIMPA', record.data.ItemIMPA);
                            contextRecord.set('ItemNCM', record.data.ItemNCM);
                        }
                    });
                }

                Ext.Msg.hide();
                me.destroy();
            },
            failure: function() {
                Ext.Msg.hide();
            }
        });
    }
});