/**
 * Created by dmytro on 31.07.16.
 */
'use strict'
function GoogleResError(message) {
    Error.call(this, message);
    this.name = 'GoogleResError';
    this.message = message;

    Error.captureStackTrace(this, GoogleResError);
}

GoogleResError.prototype = Object.create(Error.prototype);

module.exports = GoogleResError;