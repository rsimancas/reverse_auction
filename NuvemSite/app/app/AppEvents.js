Ext.define('Nuvem.AppEvents', {
    singleton: true,
    mixins: {
        observable: 'Ext.util.Observable'
    },

    constructor: function(config) {
        // The Observable constructor copies all of the properties of `config` on
        // to `this` using Ext.apply. Further, the `listeners` property is
        // processed to add listeners.
        //
        this.mixins.observable.constructor.call(this, config);

        this.addEvents(
            'newBroadcast',
            'refreshChat',
            'notification',
            'viewportLoaded',
            'quit'
        );
    },

    listeners: {
        newBroadcast: function(data) {
            var commandObj = JSON.parse(data),
                record = null;

            if (commandObj.CommandType === "ChatMessage") {
                record = JSON.parse(commandObj.CommandText);
                this.fireEvent('refreshChat', record);
                this.fireEvent('notification', record);
                //alert("Mensaje de {0} {1}".format(record.FromCustName, record.QMessageText));
            }

            if (commandObj.CommandType === "Notification") {
                record = JSON.parse(commandObj.CommandText);
                this.fireEvent('notification', record);
            }
        },

        notification: function(data) {
            //console.log('Notification', data);
        }
    }
});
