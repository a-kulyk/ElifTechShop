/**
 * Created by dmytro on 09.07.16.
 */
var Order = require('./order');
var Car = require('./car');

for (var i = 0; i < 13; i++) {
    var car = {}
    new Car(car).save(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log(doc);
        }
    })
}


/*Order.findOne({trackingCode: "97815290-85df-4571-b624-49d832e9e053"}, function (err, doc) {
 if (!err) {
 Car.findOne({order: doc._id}, function (err, doc) {
 if (!err) {
 console.log(doc);
 } else {
 console.log(err);
 }
 });

 } else {
 console.log(err)
 }
 });*/


/*Car.findOne({isAvailable: true}, function (err, doc) { // returns null if there is no car
    if (!err) {
        doc.isAvailable = false;
        doc.save(function (errm, doc2) {
            if (err) {
                console.log(err)
            }
            ;
            console.log(doc2);
        });
    } else {
        console.log(err);
    }
});*/

