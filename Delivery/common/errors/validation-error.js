/**
 * Created by dmytro on 31.07.16.
 */
'use strict'
function ValidationError(message) {
    Error.call(this, message);
    this.name = 'ValidationError';
    this.message = message;

    Error.captureStackTrace(this, ValidationError);
}

ValidationError.prototype = Object.create(Error.prototype);

module.exports=ValidationError;