const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const projectInquiry = {
    payload: Joi.object().keys({
        name: Joi.string().required().label('Name'),
        role: Joi.string().required().label('Role'),
        phone: Joi.string().required().label('Phone'),
        budget: Joi.string().required().label('Budget'),
        projectType: Joi.string().required().label('Project Type'),
        companyName: Joi.string().required().label('Company Name'),
        aboutProject: Joi.string().required().label('About Project'),
        email: Joi.string().email().trim().required().custom(value => `${value.toLowerCase()}`, 'toLowerCase').label('Email'),
    })
}

module.exports = {
    projectInquiry
}