//var bank = require("../app");

module.exports = function(app) {
    return app.service('shared', function() {
        var account;
        var confirmMessage;
        var accounts;

        return {
            getAccount: function() {
                return account;
            },
            setAccount: function(value) {
                account = value;
            },
            getMessage: function() {
                return confirmMessage;
            },
            setMessage: function(value) {
                confirmMessage = value;
            },
            getAccounts: function() {
                return accounts;
            },
            setAccounts: function(values) {
                accounts = values;
            }
        }
    });
};
