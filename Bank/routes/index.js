var User = require('../models/user').User;
var Transaction = require('../models/transaction').Transaction;
var config = require('../config');
module.exports = function(app){
    app.post('/signup', require('./signup').post);

    app.post("/login", require('./login').post);
    
    app.post("/logout", require('./logout').post);

    app.post("/pay", require('./pay').post);
    
    app.post("/transfer", require('./transfer').post);
    
    app.post("/api/transaction", require("./transaction").post);

    app.get("/api/transaction", require("./transaction").get);

    app.get("/history", require("./history").get);
    
    app.get("/islogin", require("./islogin").get);

    app.get("/user", require("./user").get);
    
    app.post("/account", require('./account').post);
    
    app.get("/account", require('./account').get);

    app.delete("/account/:id", require('./account').delete);
};