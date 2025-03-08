const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const login = {
    payload: Joi.object().keys({
        email: Joi.string().required().trim().custom(value => `${value.toLowerCase()}`, 'toLowerCase').label('email'),
        password: Joi.string().required().trim().label('Password'),
    })
}

const signUp = {
    payload: Joi.object().keys({
        firstName: Joi.string().required().trim().label('firstName'),
        lastName: Joi.string().required().trim().label('lastName'),
        role: Joi.string().required().valid('superadmin', 'pgowner', 'user').trim().label('role'),
        email: Joi.string().email().required().custom(value => `${value.toLowerCase()}`, 'toLowerCase').trim().label('email'),
        password: Joi.string().required().trim().label('password'),
        phoneNumber: Joi.string().required().trim().label('phoneNumber'),
    })
}

module.exports = {
    login,
    signUp
}