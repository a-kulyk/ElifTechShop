"use strict";

const cloudinary = require('cloudinary');
const cloudinaryConfig = require('../config/private/cloudinary');

cloudinary.config(cloudinaryConfig);
// cloudinary.config({
//     cloud_name: 'dhp4idztb',
//     api_key: '714746951499752',
//     api_secret: 'rDhK-8c7TlGTIIeTv1Z9QzIU1vo'
// });

var cloudinaryImageService = {};

cloudinaryImageService.upload = function(filePath) {

    return cloudinary.uploader.upload(filePath)
        .then( function(result) {
            //ToDo: delte file by filePath
            return {
                url: result.url
            };
        })
        .catch(function(err){
            console.error(err);
            //throw err;
        });
};

//http://res.cloudinary.com/dhp4idztb/image/upload/v1469815135/yrrs3hdtmwi8fxaj6dg3.png
cloudinaryImageService.getPublicIdByUrl = function(url) {
    let publicIdReg = /\/(\w+)\.\w{3,4}$/i;
    let publicId = url.match(publicIdReg);

    if(!publicId) {
        return null;
    }

    return publicId[1];
};

cloudinaryImageService.deleteByUrls = function(urls) {
    let publicIds = [];
    for(var i = 0; i < urls.length; i++) {
        let publicId = this.getPublicIdByUrl(urls[i]);
        if(publicId) {
            publicIds.push(publicId);
        }
    }

    if(publicIds.length <= 0){
        return;
    }

    cloudinary.api.delete_resources(publicIds)
        .then( function(result) {
            console.log(result);//ToDO: delete
        })
        .catch(function(err){
            console.error(err);
        });
};

module.exports = cloudinaryImageService;