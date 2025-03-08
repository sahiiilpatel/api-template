const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const hireDeveloper = {
    payload: Joi.object().keys({
        name: Joi.string().required().label('Name'),
        phone: Joi.string().required().label('Phone'),
        email: Joi.string().email().trim().required().custom(value => `${value.toLowerCase()}`, 'toLowerCase').label('Email'),
        workingHours: Joi.string().required().label('Working Hours'),
        developerQuantity: Joi.string().required().label('Developer Quantity'),
        projectDescription: Joi.string().required().label('Project Description')
    })
}

module.exports = {
    hireDeveloper
}