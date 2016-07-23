/**
 * Created by dmytro on 23.07.16.
 */
"use strict";
let config = require('../config');
let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: config.get("email-sender:service"),
    auth: {
        user: config.get("email-sender:user"),
        pass: config.get("email-sender:password")
    }
});

exports.notifyAboutDelivery=function (username) {
    let subject='Delivery service notification';
    let text='Your order has been successfully delivered';
    let mailOptions = {
        from: config.get("email-sender:user"),
        to: username,
        subject: subject,
        text: text
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        };
    });
}