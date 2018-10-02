Ext.define('Nuvem.view.vendors.Support', {
    extend: 'Ext.form.Panel',
    alias: 'widget.vendorsSupport',
    xtype: 'vendors-support',
    itemId: 'vendorsSupport',

    layout: {
        type: 'column'
    },

    bodyPadding: 10,

    title: 'Suporte',

    initComponent: function() {
        var me = this,
            commonHeight = 0.65;

        var firstDayOfYear = new Date();

        firstDayOfYear = new Date(firstDayOfYear.getFullYear(), 0, 1);

        Ext.applyIf(me, {
            items: [],
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
        //me.onSearchFieldChange(true);
    },

    onSearchFieldChange: function(fromOnRenderForm) {
        var me = this,
            field = me.down('#searchfield'),
            fieldValue = field.getRawValue(),
            grid = me.down('#gridMain'),
            chartA = me.down('#quoteChartA');

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

            chartA.store.load({
                params: {
                    query: fieldValue
                },
                callback: function() {
                    chartA.getEl().unmask();
                }
            });

        } else {
            grid.store.loadPage(1, {
                callback: function() {
                    me.RecalcTotals();
                    this.lastOptions.callback = null;
                }
            });

            chartA.store.load({
                callback: function() {
                    chartA.getEl().unmask();
                }
            });
        }
    }
});
