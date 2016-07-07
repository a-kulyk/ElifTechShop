var User = require('../models/user').User;
var Transaction = require('../models/transaction').Transaction;
var config = require('../config');
module.exports = function(app){
    app.post('/signup', require('./signup').post);

    app.post("/login", require('./login').post);
    
    app.post("/logout", require('./logout').post);

    app.post("/pay", function(req, res){
        User.findOne({_id: req.session.user}, function (err, user) {
            if (err) {
                res.send({
                    "success": false,
                    "errorDescription": "Server error"
                });
            }
            if (user) {
                user.amount += req.body.amount;
                user.save(function (err) {
                    if(err){
                        res.send({
                            "success": false,
                            "errorDescription": err
                        });
                    } else {
                        var transaction = new Transaction({
                            from: user._id,
                            to: user._id,
                            amount: req.body.amount
                        });
                        transaction.save(function (err) {
                            if(err){
                                res.send({
                                    "success": false,
                                    "errorDescription": err
                                });
                            }
                            res.send({
                                "success": true,
                                "amount": user.amount
                            });
                        });

                    }
                })
            } else {
                res.send({
                    "success": false,
                    "errorDescription": "User not found"
                })
            }
        });
    });
    
    app.post("/transfer",function (req, res) {
        if(req.body.to == req.session.user){
            res.send({
                "success": false,
                "errorDescription": "Disable"
            });
        } else {
            User.findOne({_id: req.session.user}, function (err, from) {
                if (err) {
                    console.log(err);
                    res.send({
                        "success": false,
                        "errorDescription": "Server error"
                    });
                } else {
                    if (from.amount >= req.body.amount) {
                        var transaction = new Transaction({
                            from: req.session.user,
                            to: req.body.to,
                            amount: req.body.amount
                        });
                        transaction.save(function (err) {
                            if (err) {
                                console.log(err);
                                res.send({
                                    "success": false,
                                    "errorDescription": "Server error"
                                })
                            } else {
                                from.amount -= req.body.amount;
                                User.findOne({_id: req.body.to}, function (err, to) {
                                    if (err) {
                                        console.log(err);
                                        res.send({
                                            "success": false,
                                            "errorDescription": "Server error"
                                        });
                                    } else {
                                        to.amount += req.body.amount;
                                        from.save(function (err) {
                                            if (err) {
                                                console.log(err);
                                                res.send({
                                                    "success": false,
                                                    "errorDescription": "Server error"
                                                });
                                            } else {
                                                to.save(function (err) {
                                                    if (err) {
                                                        console.log(err);
                                                        res.send({
                                                            "success": false,
                                                            "errorDescription": "Server error"
                                                        });
                                                    } else {
                                                        res.send({
                                                            "success": true,
                                                            "transaction_id": transaction._id
                                                        });
                                                    }
                                                })
                                            }
                                        });
                                    }
                                })
                            }
                        })
                    } else {
                        res.send({
                            "success": false,
                            "errorDescription": "Insufficient funds"
                        });
                    }
                }
            });
        }
    });
    
    app.post("/transaction", function (req, res) {
       if(req.body.API_KEY != config.get("key")){
           res.send({
               "success": false,
               "errorDescription": "Invalid key"
           })
       } else {
           User.findOne({_id: req.body.from}, function (err, from) {
               if(err){
                   res.send({
                       "success": false,
                       "errorDescription": "Server error"
                   });
               } else {
                   if (from.amount >= req.body.amount) {
                       var transaction = new Transaction({
                           from: req.body.from,
                           to: req.body.to,
                           amount: req.body.amount
                       });
                       transaction.save(function (err) {
                           if (err) {
                               res.send({
                                   "success": false,
                                   "errorDescription": "Server error"
                               })
                           } else {
                               from.amount -= req.body.amount;
                               User.findOne({_id: req.body.to}, function (err, to) {
                                   if(err){
                                       res.send({
                                           "success": false,
                                           "errorDescription": "Server error"
                                       });
                                   } else{
                                       to.amount += req.body.amount;
                                       from.save(function (err) {
                                          if(err){
                                              res.send({
                                                  "success": false,
                                                  "errorDescription": "Server error"
                                              }); 
                                          } else {
                                              to.save(function (err) {
                                                  if(err){
                                                      res.send({
                                                          "success": false,
                                                          "errorDescription": "Server error"
                                                      });
                                                  } else {
                                                      res.send({
                                                         "success": true,
                                                          "transaction_id": transaction._id
                                                      });
                                                  }
                                              })
                                          }
                                       });
                                   }
                               })
                           }
                       })
                   } else {
                       res.send({
                           "success": false,
                           "errorDescription": "Insufficient funds"
                       });
                   }
               }
           });
           
       }
    });

    app.get("/get_transaction", function (req, res) {
        console.log(req);
       Transaction.findOne({
           _id: req.query.id,
           from: req.query.from,
           to: req.query.to,
           amount: req.query.amount,
           date: {
               "$gte": req.query.date,
               "$lt": Date.now()
           }
       }, function (err, transaction) {
           if(err){
               res.send({
                   "success": false,
                   "errorDescription": "Server error"
               });
           } else {
               if(transaction){
                   res.send({
                       "success": true,
                       "exists": true
                   });
               } else {
                   res.send({
                       "success": true,
                       "exists": false
                   });
               }
           }
       });
    });

    app.get("/history", function (req, res) {
        var user = req.session.user;
        console.log(user);
        Transaction
            .find({
                $or: [
                    { from: user },
                    { to: user }
                ]
            })
            .exec(function (err, transactions) {
                if(err){
                    res.send({
                        "success": false,
                        "errorDescription": "Server error"
                    });
                } else {
                    res.send({
                        "success": true,
                        "transactions": transactions
                    })
                }
            });
    })
};