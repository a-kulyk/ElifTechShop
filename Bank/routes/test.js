let Promise = require('promise');
let User = require('../models/user').User;
let Transaction = require('../models/transaction').Transaction;

let fromUser = User.findOne({_id: '5773c1b809aaa4fd2f7c4f9e'});
let toUser = User.findOne({_id: '5773d50ef6e5bd063d119d27'});
Transaction.action('5773c1b809aaa4fd2f7c4f9e', '5773d50ef6e5bd063d119d27', 2)
    .then(function (result) {
        console.log(result);
    })
    .catch(function (error) {
        console.log(error);
    });

// Promise.all([fromUser, toUser])
//     .then(function (result) {
//        console.log(result);
//     })
//     .catch(function (error) {
//         console.log(error);
//     });


// let userPromise = new Promise(function (resolve, reject) {
//     User.findOne({_id: '5773bf15aa77e4632eda318a'}, function (err, data) {
//         if(err){
//             reject(err);
//         }
//         if(data){
//             resolve(data);
//         } else {
//             reject("User error");
//         }
//     });
// })
//     .then(function (result) {
//         return new Promise(function (resolve, reject) {
//             Transaction.findOne({to: '5773bf15aa77e4632eda318a'}, function (err, data) {
//                 if(err){
//                     reject(err);
//                 }
//                 if(data){
//                     resolve(
//                         {
//                             transaction: data,
//                             user: result
//                         });
//                 } else {
//                     reject("Transaction error");
//                 }
//             })
//         });
//     })
//     .then(function (result) {
//         console.log(result);
//     })
//     .catch(function (error) {
//        console.log(error);
//     });
