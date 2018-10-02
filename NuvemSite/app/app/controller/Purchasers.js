Ext.define('Nuvem.controller.Purchasers', {
    extend: 'Ext.app.Controller',

    models: [

    ],

    stores: [

    ],

    views: [
        
    ],

    initGeneral: function(application) {
        Ext.checkSecurityToken();

        var user = Nuvem.GlobalSettings.currentUser;

        if (!user.CustKey) {
            Ext.Router.redirect('!');
            return;
        }

        var askBeforeOut = function() {
            return 'Você quer sair?';
        };

        window.onbeforeunload = askBeforeOut;

        var viewport = Ext.ComponentQuery.query("#appViewPort");

        var createGeneral = function() {
            var vp = viewport[0];

            vp.getEl().mask("Aguarde...");

            var form = Ext.widget('purchasersGeneral', {});

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
        };

        if (!viewport.length) {
            Nuvem.AppEvents.on('viewportLoaded', function() {
                setTimeout(function() {
                    createGeneral();
                }, 400);
            });
        } else {
            var formQuotes = viewport[0].down("#purchasersGeneral");
            if (!formQuotes) {
                createGeneral();
            } else {
                var cpanel = viewport[0].down("#app_ContentPanel"),
                    currentForm = cpanel.down('form');

                formQuotes.down('#pagingtoolbar').doRefresh(function() {
                    this.lastOptions.callback = null;
                });

                formQuotes.show();
                formQuotes.getEl().slideIn('l', {
                    easing: 'backOut',
                    duration: 1000
                });
            }
        }
    },

    editQuote: function(params) {
        Ext.checkSecurityToken();
        var user = Nuvem.GlobalSettings.currentUser;

        if (!user.CustKey) {
            Ext.Router.redirect('!');
            return;
        }

        var viewport = Ext.ComponentQuery.query("#appViewPort")[0],
            cpanel = Ext.ComponentQuery.query("#app_ContentPanel")[0],
            callerForm = cpanel.down("#purchasersGeneral");

        cpanel.getEl().mask('Carregando...');

        this.loadQuote(params.id).then(function(record) {
            var form = (record.data.QHeaderType === 0) ? new Nuvem.view.purchasers.EditQuoteHeaderItem({
                currentRecord: record,
                title: 'Cotação Produto'
            }) : new Nuvem.view.purchasers.EditQuoteHeaderService({
                currentRecord: record,
                title: 'Cotação Serviço'
            });

            form.loadRecord(record);

            form.callerForm = callerForm;

            if (callerForm) {
                callerForm.hide();
            }

            cpanel.add(form);

            form.getEl().slideIn('r', {
                easing: 'backOut',
                duration: 1000,
                listeners: {
                    afteranimate: function() {
                        //formDetail.down("field[name=searchField]").focus(true, 200);
                    }
                }
            });

            cpanel.getEl().unmask();
        });
    },

    loadQuote: function(id) {
        var deferred = Ext.create('Deft.Deferred');

        new Nuvem.store.QuoteHeaders().load({
            params: {
                id: id
            },
            callback: function(records, operation, success) {
                if (success) {
                    deferred.resolve(records[0]);
                } else {
                    deferred.reject("Error loading Companies.");
                }
            }
        });

        return deferred.promise;
    },

    editOffer: function(params) {
        Ext.checkSecurityToken();
        var user = Nuvem.GlobalSettings.currentUser;

        if (!user.CustKey) {
            Ext.Router.redirect('!');
            return;
        }

        var viewport = Ext.ComponentQuery.query("#appViewPort")[0],
            cpanel = Ext.ComponentQuery.query("#app_ContentPanel")[0],
            callerForm = cpanel.down("#purchasersGeneral");

        cpanel.getEl().mask('Carregando...');

        this.loadOffer(params.id).then(function(record) {
            if (!Ext.isObject(record)) {
                var msg = "Não existem propostas para esta ordem de compra";
                var msgBox = Ext.MessageBox.show({
                    msg: '<div class="wellcome-signed-text"><p><span class="fa fa-info-circle"></span><br>{0}</p></div>'.format(msg),
                    title: "Nuvem B2B",
                    buttons: Ext.MessageBox.OK,
                    fn: function() {
                        Ext.Router.redirect('!purchasers');
                    }
                });
                cpanel.getEl().unmask();
                msgBox.center();
                return;
            }

            var form = new Nuvem.view.purchasers.EditQuoteHeaderOffers({
                currentRecord: record
            });

            if (callerForm) {
                callerForm.hide();
            }

            form.callerForm = callerForm;

            cpanel.add(form);

            form.getEl().slideIn('r', {
                easing: 'backOut',
                duration: 1000,
                listeners: {
                    afteranimate: function() {
                        //formDetail.down("field[name=searchField]").focus(true, 200);
                        var grid = form.down('#gridOffers');
                        grid.reconfigure(record.store);
                        if (grid.store.getCount() > 0) {
                            grid.getSelectionModel().select(0);
                        }
                    }
                }
            });

            cpanel.getEl().unmask();
        });
    },

    loadOffer: function(id) {
        var deferred = Ext.create('Deft.Deferred');

        new Nuvem.store.QuoteOffers().load({
            params: {
                fieldFilters: JSON.stringify({
                    fields: [
                        { name: 'QHeaderKey', type: 'int', value: id }
                    ]
                })
            },
            callback: function(records, operation, success) {
                if (success) {
                    deferred.resolve(records[0]);
                } else {
                    deferred.reject("Error loading Companies.");
                }
            }
        });

        return deferred.promise;
    },

    initControlPanel: function(application) {
        Ext.checkSecurityToken();

        var user = Nuvem.GlobalSettings.currentUser;

        if (!user.CustKey) {
            Ext.Router.redirect('!');
            return;
        }

        var askBeforeOut = function() {
            return 'Você quer sair?';
        };

        window.onbeforeunload = askBeforeOut;

        var createPanel = function() {
            var vp = viewport[0];

            vp.getEl().mask("Aguarde...");

            var form = Ext.widget('purchasersPanel', {});

            var panel = vp.down('#app_ContentPanel');

            panel.removeAll();
            panel.add(form);

            form.getEl().slideIn('r', {
                easing: 'backOut',
                duration: 1000,
                listeners: {
                    afteranimate: function() {
                        if (form.down("#searchfield"))
                            form.down("#searchfield").focus(true, 200);
                        vp.getEl().unmask();
                    }
                }
            });
        };

        var viewport = Ext.ComponentQuery.query("#appViewPort");

        if (!viewport.length) {
            Nuvem.AppEvents.on('viewportLoaded', function() {
                createPanel();
            });
        } else {
            var formPanel = viewport[0].down("#purchasersPanel");
            if (!formPanel) {
                createPanel();
            } else {
                var cpanel = viewport[0].down("#app_ContentPanel");

                formPanel.show();
                formPanel.getEl().slideIn('l', {
                    easing: 'backOut',
                    duration: 1000
                });
            }
        }
    },

    initSupport: function(application) {
        Ext.checkSecurityToken();

        var user = Nuvem.GlobalSettings.currentUser;

        if (!user.CustKey) {
            Ext.Router.redirect('!');
            return;
        }

        var askBeforeOut = function() {
            return 'Você quer sair?';
        };

        window.onbeforeunload = askBeforeOut;

        var createSupport = function() {
            var vp = viewport[0];

            vp.getEl().mask("Aguarde...");

            var form = Ext.widget('purchasersSupport', {});

            var panel = vp.down('#app_ContentPanel');

            panel.removeAll();
            panel.add(form);

            form.getEl().slideIn('r', {
                easing: 'backOut',
                duration: 1000,
                listeners: {
                    afteranimate: function() {
                        if (form.down("#searchfield"))
                            form.down("#searchfield").focus(true, 200);
                        vp.getEl().unmask();
                    }
                }
            });
        };

        var viewport = Ext.ComponentQuery.query("#appViewPort");

        if (!viewport.length) {
            Nuvem.AppEvents.on('viewportLoaded', function() {
                createSupport();
            });
        } else {
            var form = viewport[0].down("#purchasersSupport");
            if (!form) {
                createSupport();
            } else {
                var cpanel = viewport[0].down("#app_ContentPanel");
                
                form.show();
                form.getEl().slideIn('l', {
                    easing: 'backOut',
                    duration: 1000
                });
            }
        }
    }
});
