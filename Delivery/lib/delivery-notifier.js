/**
 * Created by dmytro on 23.07.16.
 */
"use strict";
let config = require('../config');
let nodemailer = require('nodemailer');
let request = require('request');

let transporter = nodemailer.createTransport({
    service: config.get("email-sender:service"),
    auth: {
        user: config.get("email-sender:user"),
        pass: config.get("email-sender:password")
    }
});

exports.sendEmail = function (username, trackingCode) {
    return new Promise((resolve, reject)=> {
        let subject = 'Delivery service notification';
        let mailOptions = {
            from: config.get("email-sender:user"),
            to: username,
            subject: subject,
            html: `<h2>Your order has been successfully delivered</h2>` +
           `<a href="http://localhost:3000/#/order_info/${trackingCode}">Check its status here</a>`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                reject();
            } else {
                console.log('Message sent: ' + info.response);
                resolve(trackingCode);
            }
            ;
        });
    });
}
exports.notifyShop = function (trackingCode) {
    return new Promise((resolve, reject)=> {
        request({
            url: config.get("shop:url"),
            method: 'PUT',
            json: {"trackingCode": trackingCode},
        }, function (err, response, body) {
            if (err) {
                reject(err);
            }
            console.log("response: " + response)
            resolve(response);
        });
    });
}