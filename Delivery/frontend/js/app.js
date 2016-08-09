/**
 * Created by dmytro on 04.08.16.
 */
let angular = require('angular');
let ngRoute = require('angular-route');
let ngMessages = require('angular-messages');
let pagination = require('angular-utils-pagination');
require('angularjs-acl/dist/acl.js');

let app = angular.module('delivery', [ngRoute, ngMessages, pagination, 'ng-acl']);

app.run(['AclService', function (AclService) {
    AclService.addRole('guest');
    AclService.addRole('admin');

    AclService.addResource('History');
    AclService.addResource('Order');

    AclService.allow('guest', 'Order');
    AclService.allow('admin', 'History');

    //Let's assume that you have some user object that implements AclRoleInterface. This is optional feature.
    var guest = {
        id: 1,
        name: 'Duck',
        getRoles: function () {
            return ['guest'];
        },
    };
    AclService.setUserIdentity(guest);
}]);

require('./config/app-config')(app);
require('./services/order-states-service')(app);
require('./controllers/create-order-controller')(app);
require('./controllers/history-controller')(app);
require('./controllers/order-info-controller')(app);
require('./controllers/track-order-controller')(app);
require('./controllers/login-controller')(app);
require('./controllers/admin-controller')(app);