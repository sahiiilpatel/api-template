const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const dashboard = {
    // payload: Joi.object().keys({
    //     amount: Joi.any().required().label('Amount'),
    //     name: Joi.string().required().trim().label('Name'),
    //     planId: Joi.string().required().trim().label('PlanId'),
    // })
}

module.exports = {
    dashboard
}