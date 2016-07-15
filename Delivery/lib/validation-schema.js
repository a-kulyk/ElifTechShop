/**
 * Created by dmytro on 07.07.16.
 */
module.exports = {
    'title': {
        notEmpty: true,
        isLength: {
            options: [{min:3, max: 16}],
            errorMessage: 'Must be between 2 and 16 chars long'
        },
        errorMessage: 'Invalid title'
    }, 'price': {
        notEmpty: true,
        isFloat: {
            errorMessage: 'Price must be numeric between 1 and 1000000',
            options:[{min: 1, max: 1000000}]
        }
    }, 'from.username': {
        notEmpty: true,
        isLength: {
            options: [{min: 3, max: 16}],
            errorMessage: 'Must be between 2 and 16 chars long'
        }
    }, 'from.lng': {
        notEmpty: true,
        isFloat: {
            errorMessage: 'lng must be numeric'
        }
    },
    'from.lat': {
        notEmpty: true,
        isFloat: {
            errorMessage: 'lat must be numeric'
        }
    },
    'to.username': {
        notEmpty: true,
        isLength: {
            options: [{min: 3, max: 16}],
            errorMessage: 'Must be between 2 and 16 chars long'
        }
    },
    'to.lng': {
        notEmpty: true,
        isFloat: {
            errorMessage: 'lng must be numeric'
        }
    },
    'to.lat': {
        notEmpty: true,
        isFloat: {
            errorMessage: 'lat must be numeric'
        }
    }
}